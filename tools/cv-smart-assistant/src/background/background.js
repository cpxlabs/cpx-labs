importScripts('../lib/storage.js');

chrome.runtime.onInstalled.addListener(() => {
  console.log('CV Smart Assistant installed');
  chrome.contextMenus.create({
    id: 'map-to-field',
    title: 'Map to CV Field',
    contexts: ['editable'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'map-to-field') {
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_FIELD_MAPPER',
      x: info.x || 0,
      y: info.y || 0,
    });
  }
});

const SITE_HANDLERS = [
  { name: 'LinkedIn', matches: (url) => url.includes('linkedin.com') },
  { name: 'Greenhouse', matches: (url) => url.includes('greenhouse.io') },
  { name: 'Lever', matches: (url) => url.includes('lever.co') },
  { name: 'Workday', matches: (url) => url.includes('myworkdayjobs.com') || url.includes('wd5.myworkdayjobs.com') },
];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case 'GET_STORAGE_DATA': {
        try {
          const result = await chrome.storage.local.get('cvData');
          const resumeResult = await chrome.storage.local.get('resumeFile');
          const data = result && result.cvData ? result.cvData : null;
          const resume = resumeResult && resumeResult.resumeFile ? resumeResult.resumeFile : null;
          sendResponse({ cvData: data, resumeFile: resume });
        } catch {
          sendResponse(null);
        }
        break;
      }
      case 'SAVE_STORAGE_DATA': {
        try {
          const payload = { cvData: { data: message.data, timestamp: Date.now() } };
          await chrome.storage.local.set(payload);
          sendResponse(true);
        } catch {
          sendResponse(false);
        }
        break;
      }
      case 'GET_STORAGE_RECENT': {
        try {
          const result = await chrome.storage.local.get('recentFiles');
          sendResponse(result && result.recentFiles ? result.recentFiles : []);
        } catch {
          sendResponse([]);
        }
        break;
      }
      case 'SAVE_STORAGE_RECENT': {
        try {
          const result = await chrome.storage.local.get('recentFiles');
          let files = result && result.recentFiles ? result.recentFiles : [];
          files.unshift({
            name: message.fileInfo.name,
            timestamp: message.fileInfo.timestamp || Date.now(),
            path: message.fileInfo.path || '',
          });
          files = files.slice(0, 10);
          await chrome.storage.local.set({ recentFiles: files });
          sendResponse(true);
        } catch {
          sendResponse(false);
        }
        break;
      }
      case 'GET_SITE_HANDLER': {
        try {
          const url = message.url || '';
          const handler = SITE_HANDLERS.find((h) => h.matches(url));
          sendResponse(handler ? handler.name : null);
        } catch {
          sendResponse(null);
        }
        break;
      }
      case 'SET_PASSWORD': {
        try {
          const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(message.password), 'PBKDF2', false, ['deriveKey']);
          const key = await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: new TextEncoder().encode('session-salt'), iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
          );
          const raw = await crypto.subtle.exportKey('raw', key);
          const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
          await chrome.storage.session.set({ sessionKey: b64 });
          sendResponse({ success: true });
        } catch { sendResponse({ success: false }); }
        break;
      }
      case 'GET_PASSWORD_STATUS': {
        try {
          const result = await chrome.storage.session.get('sessionKey');
          sendResponse({ hasPassword: !!result.sessionKey });
        } catch { sendResponse({ hasPassword: false }); }
        break;
      }
      case 'CLEAR_PASSWORD': {
        try {
          await chrome.storage.session.remove('sessionKey');
          sendResponse({ success: true });
        } catch { sendResponse({ success: false }); }
        break;
      }
      case 'ENCRYPT_DATA': {
        try {
          const { salt, iv, data } = await StorageAPI.encryptData(message.data, message.password);
          const payload = { cvData: { encrypted: true, salt, iv, data, timestamp: Date.now() } };
          await chrome.storage.local.set(payload);
          sendResponse({ success: true });
        } catch { sendResponse({ success: false }); }
        break;
      }
      case 'DECRYPT_DATA': {
        try {
          const result = await chrome.storage.local.get('cvData');
          const cvData = result && result.cvData ? result.cvData : null;
          if (!cvData || !cvData.encrypted) { sendResponse({ data: null }); return; }
          const decrypted = await StorageAPI.decryptData(cvData, message.password);
          sendResponse({ data: decrypted });
        } catch { sendResponse({ data: null }); }
        break;
      }
      case 'STORE_RESUME': {
        try {
          await chrome.storage.local.set({ resumeFile: { name: message.name, blob: message.blob } });
          sendResponse({ success: true });
        } catch { sendResponse({ success: false }); }
        break;
      }
      case 'GET_RESUME': {
        try {
          const result = await chrome.storage.local.get('resumeFile');
          sendResponse(result && result.resumeFile ? result.resumeFile : null);
        } catch { sendResponse(null); }
        break;
      }
      case 'STORE_MAPPING': {
        try {
          const result = await chrome.storage.local.get('customMappings');
          const mappings = result && result.customMappings ? result.customMappings : [];
          mappings.push({ selector: message.selector, field: message.field });
          await chrome.storage.local.set({ customMappings: mappings });
          sendResponse({ success: true });
        } catch { sendResponse({ success: false }); }
        break;
      }
      case 'GET_MAPPINGS': {
        try {
          const result = await chrome.storage.local.get('customMappings');
          sendResponse(result && result.customMappings ? result.customMappings : []);
        } catch { sendResponse([]); }
        break;
      }
      default:
        sendResponse(null);
    }
  })();
  return true;
});
