const fs = require('fs');
const path = require('path');

const bgSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'background', 'background.js'), 'utf-8');

let messageHandlers = {};
let storageData = {};
let sessionData = {};
let onInstalledHandler = null;

beforeEach(() => {
  storageData = {};
  sessionData = {};

  global.chrome = {
    runtime: {
      onInstalled: {
        addListener: jest.fn((handler) => {
          onInstalledHandler = handler;
        }),
      },
      onMessage: {
        addListener: jest.fn((handler) => {
          messageHandlers = handler;
        }),
      },
    },
    storage: {
      local: {
        get: jest.fn((key, cb) => {
          const result = {};
          const keys = Array.isArray(key) ? key : [key];
          for (const k of keys) {
            result[k] = storageData[k] !== undefined ? storageData[k] : null;
          }
          if (cb) cb(result);
          return Promise.resolve(result);
        }),
        set: jest.fn((items, cb) => {
          Object.assign(storageData, items);
          if (cb) cb();
        }),
        remove: jest.fn((keys, cb) => {
          const ks = Array.isArray(keys) ? keys : [keys];
          for (const k of ks) delete storageData[k];
          if (cb) cb();
        }),
      },
      session: {
        get: jest.fn((keys, cb) => {
          const result = {};
          const ks = Array.isArray(keys) ? keys : [keys];
          for (const k of ks) result[k] = sessionData[k] !== undefined ? sessionData[k] : null;
          if (cb) cb(result);
          return Promise.resolve(result);
        }),
        set: jest.fn((items, cb) => {
          Object.assign(sessionData, items);
          if (cb) cb();
        }),
        remove: jest.fn((keys, cb) => {
          const ks = Array.isArray(keys) ? keys : [keys];
          for (const k of ks) delete sessionData[k];
          if (cb) cb();
        }),
      },
    },
    tabs: {},
    contextMenus: {
      create: jest.fn(),
      onClicked: {
        addListener: jest.fn(),
      },
    },
  };

  global.StorageAPI = {
    encryptData: jest.fn(() => Promise.resolve({ salt: [], iv: [], data: [] })),
    decryptData: jest.fn(() => Promise.resolve({ name: 'test' })),
  };

  global.importScripts = jest.fn();

  global.crypto = {
    subtle: {
      importKey: jest.fn(() => Promise.resolve({})),
      deriveKey: jest.fn(() => Promise.resolve({})),
      exportKey: jest.fn(() => Promise.resolve(new Uint8Array(32).buffer)),
    },
  };

  eval(bgSrc);
});

afterEach(() => {
  delete global.crypto;
});

beforeEach(() => {
  if (onInstalledHandler) onInstalledHandler();
});

afterEach(() => {
  delete global.chrome;
  delete global.StorageAPI;
  onInstalledHandler = null;
});

function sendMessage(msg) {
  return new Promise((resolve) => {
    messageHandlers(msg, null, (response) => {
      resolve(response);
    });
  });
}

describe('Background Service Worker', () => {
  test('registers onInstalled listener', () => {
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
  });

  test('creates context menu', () => {
    expect(chrome.contextMenus.create).toHaveBeenCalledWith({
      id: 'map-to-field',
      title: 'Map to CV Field',
      contexts: ['editable'],
    });
  });

  describe('GET_STORAGE_DATA', () => {
    test('returns null when no data stored', async () => {
      const result = await sendMessage({ type: 'GET_STORAGE_DATA' });
      expect(result).toEqual({ cvData: null, resumeFile: null });
    });

    test('returns stored cvData', async () => {
      storageData.cvData = { data: { name: 'John' }, timestamp: 1000 };
      const result = await sendMessage({ type: 'GET_STORAGE_DATA' });
      expect(result.cvData.data).toEqual({ name: 'John' });
    });
  });

  describe('SAVE_STORAGE_DATA', () => {
    test('saves data with timestamp', async () => {
      const result = await sendMessage({ type: 'SAVE_STORAGE_DATA', data: { name: 'Jane' } });
      expect(result).toBe(true);
      expect(storageData.cvData.data).toEqual({ name: 'Jane' });
      expect(storageData.cvData.timestamp).toBeDefined();
    });
  });

  describe('GET_SITE_HANDLER', () => {
    test('detects LinkedIn URL', async () => {
      const result = await sendMessage({ type: 'GET_SITE_HANDLER', url: 'https://linkedin.com/jobs' });
      expect(result).toBe('LinkedIn');
    });

    test('detects Greenhouse URL', async () => {
      const result = await sendMessage({ type: 'GET_SITE_HANDLER', url: 'https://boards.greenhouse.io/acme' });
      expect(result).toBe('Greenhouse');
    });

    test('detects Lever URL', async () => {
      const result = await sendMessage({ type: 'GET_SITE_HANDLER', url: 'https://jobs.lever.co/acme' });
      expect(result).toBe('Lever');
    });

    test('detects Workday URL', async () => {
      const result = await sendMessage({ type: 'GET_SITE_HANDLER', url: 'https://acme.myworkdayjobs.com/careers' });
      expect(result).toBe('Workday');
    });

    test('returns null for unknown URL', async () => {
      const result = await sendMessage({ type: 'GET_SITE_HANDLER', url: 'https://google.com' });
      expect(result).toBeNull();
    });
  });

  describe('SAVE_STORAGE_RECENT', () => {
    test('adds file to recent list', async () => {
      const result = await sendMessage({
        type: 'SAVE_STORAGE_RECENT',
        fileInfo: { name: 'cv.pdf', timestamp: 100 },
      });
      expect(result).toBe(true);
      expect(storageData.recentFiles).toHaveLength(1);
      expect(storageData.recentFiles[0].name).toBe('cv.pdf');
    });

    test('caps recent files at 10', async () => {
      for (let i = 0; i < 15; i++) {
        await sendMessage({ type: 'SAVE_STORAGE_RECENT', fileInfo: { name: `f${i}.pdf`, timestamp: i } });
      }
      expect(storageData.recentFiles).toHaveLength(10);
    });
  });

  describe('GET_STORAGE_RECENT', () => {
    test('returns empty array when no recent files', async () => {
      const result = await sendMessage({ type: 'GET_STORAGE_RECENT' });
      expect(result).toEqual([]);
    });
  });

  describe('STORE_RESUME / GET_RESUME', () => {
    test('stores and retrieves resume', async () => {
      await sendMessage({ type: 'STORE_RESUME', name: 'resume.pdf', blob: 'base64data' });
      const result = await sendMessage({ type: 'GET_RESUME' });
      expect(result.name).toBe('resume.pdf');
      expect(result.blob).toBe('base64data');
    });
  });

  describe('STORE_MAPPING / GET_MAPPINGS', () => {
    test('stores and retrieves custom mappings', async () => {
      await sendMessage({ type: 'STORE_MAPPING', selector: '#name', field: 'name' });
      const result = await sendMessage({ type: 'GET_MAPPINGS' });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ selector: '#name', field: 'name' });
    });
  });

  describe('SET_PASSWORD / GET_PASSWORD_STATUS / CLEAR_PASSWORD', () => {
    test('sets password status', async () => {
      const result = await sendMessage({ type: 'SET_PASSWORD', password: 'test123' });
      expect(result.success).toBe(true);
    });

    test('returns hasPassword false initially', async () => {
      const result = await sendMessage({ type: 'GET_PASSWORD_STATUS' });
      expect(result.hasPassword).toBe(false);
    });

    test('returns hasPassword true after setting password', async () => {
      await sendMessage({ type: 'SET_PASSWORD', password: 'test123' });
      const result = await sendMessage({ type: 'GET_PASSWORD_STATUS' });
      expect(result.hasPassword).toBe(true);
    });

    test('clears password', async () => {
      await sendMessage({ type: 'SET_PASSWORD', password: 'test123' });
      await sendMessage({ type: 'CLEAR_PASSWORD' });
      const result = await sendMessage({ type: 'GET_PASSWORD_STATUS' });
      expect(result.hasPassword).toBe(false);
    });
  });
});
