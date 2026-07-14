async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encoded = new TextEncoder().encode(JSON.stringify(plaintext));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(ciphertext)),
  };
}

async function decryptData(encrypted, password) {
  const { salt, iv, data } = encrypted;
  const key = await deriveKey(password, new Uint8Array(salt));
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

const isChromeStorage = typeof chrome !== 'undefined' && chrome.storage;

const memoryStore = {};

function getStore() {
  if (isChromeStorage) {
    return chrome.storage.local;
  }
  return {
    get(keys, cb) {
      const keysArr = Array.isArray(keys) ? keys : [keys];
      const result = {};
      for (const key of keysArr) {
        result[key] = memoryStore[key] === undefined ? null : memoryStore[key];
      }
      cb(result);
    },
    set(items, cb) {
      Object.assign(memoryStore, items);
      cb();
    },
    remove(keys, cb) {
      const keysArr = Array.isArray(keys) ? keys : [keys];
      for (const key of keysArr) {
        delete memoryStore[key];
      }
      cb();
    },
    clear(cb) {
      for (const key of Object.keys(memoryStore)) {
        delete memoryStore[key];
      }
      cb();
    },
  };
}

const store = getStore();

function saveData(data, password) {
  return new Promise(async (resolve) => {
    try {
      let payload = { cvData: { data, timestamp: Date.now() } };
      if (password) {
        const encrypted = await encryptData(data, password);
        payload = { cvData: { encrypted: true, salt: encrypted.salt, iv: encrypted.iv, data: encrypted.data, timestamp: Date.now() } };
      }
      store.set(payload, () => resolve(true));
    } catch (e) {
      resolve(false);
    }
  });
}

function loadData(password) {
  return new Promise((resolve) => {
    try {
      store.get('cvData', async (result) => {
        const cvData = result && result.cvData ? result.cvData : null;
        if (!cvData) { resolve(null); return; }
        if (cvData.encrypted) {
          if (!password) { resolve(null); return; }
          try {
            const decrypted = await decryptData(cvData, password);
            resolve({ data: decrypted, timestamp: cvData.timestamp });
          } catch { resolve(null); }
        } else {
          resolve(cvData);
        }
      });
    } catch {
      resolve(null);
    }
  });
}

function saveRecent(fileInfo) {
  return new Promise((resolve) => {
    try {
      store.get('recentFiles', (result) => {
        let files = result && result.recentFiles ? result.recentFiles : [];
        files.unshift({
          name: fileInfo.name,
          timestamp: fileInfo.timestamp || Date.now(),
          path: fileInfo.path || '',
        });
        files = files.slice(0, 10);
        store.set({ recentFiles: files }, () => resolve(true));
      });
    } catch {
      resolve(false);
    }
  });
}

function loadRecent() {
  return new Promise((resolve) => {
    try {
      store.get('recentFiles', (result) => {
        resolve(result && result.recentFiles ? result.recentFiles : []);
      });
    } catch {
      resolve([]);
    }
  });
}

function clearData() {
  return new Promise((resolve) => {
    try {
      store.clear(() => resolve(true));
    } catch {
      resolve(false);
    }
  });
}

function saveTheme(darkMode) {
  return new Promise((resolve) => {
    try {
      store.set({ darkMode: !!darkMode }, () => resolve(true));
    } catch {
      resolve(false);
    }
  });
}

function loadTheme() {
  return new Promise((resolve) => {
    try {
      store.get('darkMode', (result) => {
        resolve(result && result.darkMode ? true : false);
      });
    } catch {
      resolve(false);
    }
  });
}

const StorageAPI = { saveData, loadData, saveRecent, loadRecent, clearData, saveTheme, loadTheme, encryptData, decryptData };

if (typeof window !== 'undefined') {
  window.StorageAPI = StorageAPI;
}
if (typeof module !== 'undefined') {
  module.exports = StorageAPI;
}
