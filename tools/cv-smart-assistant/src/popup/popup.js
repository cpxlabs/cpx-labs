pdfjsLib.GlobalWorkerOptions.workerSrc = '../vendors/pdf.worker.min.js';

const fields = {
  name: document.getElementById('field-name'),
  email: document.getElementById('field-email'),
  phone: document.getElementById('field-phone'),
  linkedin: document.getElementById('field-linkedin'),
  github: document.getElementById('field-github'),
  skills: document.getElementById('field-skills'),
  education: document.getElementById('field-education'),
  experience: document.getElementById('field-experience'),
};

const statusEl = document.getElementById('status');
const dropZone = document.getElementById('selectPdf');
const fileInput = document.getElementById('fileInput');
const historyList = document.getElementById('historyList');
const siteNameEl = document.getElementById('siteName');
const fillResultEl = document.getElementById('fillResult');
const themeToggle = document.getElementById('themeToggle');

let siteHandlerName = null;
let statusTimeout = null;
let hasPassword = false;
let encryptionEnabled = false;

function setStatus(msg, type) {
  type = type || 'info';
  statusEl.className = 'status ' + type;
  if (type === 'loading') {
    statusEl.textContent = msg;
    statusEl.classList.add('loading');
  } else {
    statusEl.classList.remove('loading');
    statusEl.textContent = msg;
  }
  if (statusTimeout) {
    clearTimeout(statusTimeout);
    statusTimeout = null;
  }
  if (type === 'success') {
    statusTimeout = setTimeout(() => {
      if (statusEl.classList.contains('success')) {
        setStatus('Waiting for CV...', 'info');
      }
    }, 3000);
  }
}

function getFieldData() {
  return {
    name: fields.name.value,
    email: fields.email.value,
    phone: fields.phone.value,
    linkedin: fields.linkedin.value,
    github: fields.github.value,
    skills: fields.skills.value,
    education: fields.education.value,
    experience: fields.experience.value,
  };
}

function populateFields(data) {
  fields.name.value = data.name || '';
  fields.email.value = data.email || '';
  fields.phone.value = data.phone || '';
  fields.linkedin.value = data.linkedin || '';
  fields.github.value = data.github || '';
  fields.skills.value = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '');
  fields.education.value = Array.isArray(data.education) ? data.education.join('\n') : (data.education || '');
  fields.experience.value = Array.isArray(data.experience) ? data.experience.join('\n') : (data.experience || '');
}

function relativeTime(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + ' min ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  return new Date(ts).toLocaleDateString();
}

let saveDebounce = null;

function debouncedSave() {
  if (saveDebounce) clearTimeout(saveDebounce);
  saveDebounce = setTimeout(() => {
    const data = getFieldData();
    chrome.runtime.sendMessage({ type: 'SAVE_STORAGE_DATA', data });
  }, 1000);
}

// --- Dark Mode ---

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeToggle.textContent = dark ? '☀️' : '🌙';
}

async function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const result = await chrome.runtime.sendMessage({ type: 'GET_STORAGE_DATA' });
    const data = result && result.cvData && result.cvData.data ? result.cvData.data : (result && result.data ? result.data : null);
    if (data && data._darkMode !== undefined) {
      applyTheme(data._darkMode);
      return;
    }
  } catch {}
  applyTheme(prefersDark);
}

themeToggle.addEventListener('click', async () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = !isDark;
  applyTheme(next);
  try {
    const result = await chrome.runtime.sendMessage({ type: 'GET_STORAGE_DATA' });
    let data = getFieldData();
    if (result && result.cvData && result.cvData.data) {
      data = { ...result.cvData.data, ...data };
    }
    data._darkMode = next;
    await chrome.runtime.sendMessage({ type: 'SAVE_STORAGE_DATA', data });
  } catch {}
});

// --- Drag and Drop ---

dropZone.addEventListener('click', () => {
  fileInput.click();
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    processPDF(file);
  } else {
    setStatus('Please drop a PDF file.', 'error');
  }
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) processPDF(file);
  fileInput.value = '';
});

function reconstructPageText(items) {
  if (!items || items.length === 0) return '';
  
  // Sort items: y-descending (top to bottom), then x-ascending (left to right)
  const sortedItems = [...items].sort((a, b) => {
    const yDiff = b.transform[5] - a.transform[5];
    if (Math.abs(yDiff) < 5) {
      return a.transform[4] - b.transform[4];
    }
    return yDiff;
  });

  let text = '';
  let lastY = null;
  for (const item of sortedItems) {
    const x = item.transform[4];
    const y = item.transform[5];
    if (lastY === null) {
      text += item.str;
    } else {
      const yDiff = lastY - y;
      if (Math.abs(yDiff) >= 5) {
        text += '\n' + item.str;
      } else {
        text += ' ' + item.str;
      }
    }
    lastY = y;
  }
  return text + '\n';
}

async function processPDF(file) {
  setStatus('Scanning PDF...', 'loading');
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += reconstructPageText(content.items);
    }
    const parsed = parseCVText(text);
    populateFields(parsed);
    const data = getFieldData();
    await chrome.runtime.sendMessage({ type: 'SAVE_STORAGE_DATA', data });
    await chrome.runtime.sendMessage({
      type: 'SAVE_STORAGE_RECENT',
      fileInfo: { name: file.name, timestamp: Date.now() },
    });
    setStatus('Data extracted successfully!', 'success');
    loadRecentFiles();
  } catch (err) {
    setStatus('Error reading PDF.', 'error');
    console.error(err);
  }
}

// --- Data Persistence ---

async function loadStoredData() {
  try {
    const result = await chrome.runtime.sendMessage({ type: 'GET_STORAGE_DATA' });
    if (result) {
      if (result.cvData && result.cvData.data) {
        populateFields(result.cvData.data);
      } else if (result.data) {
        populateFields(result.data);
      }
      if (result.resumeFile) {
        document.getElementById('resumeStatus').textContent = result.resumeFile.name;
      }
    }
  } catch {}
}

for (const key of Object.keys(fields)) {
  fields[key].addEventListener('input', debouncedSave);
}

// --- Recent Files ---

async function loadRecentFiles() {
  try {
    const files = await chrome.runtime.sendMessage({ type: 'GET_STORAGE_RECENT' });
    historyList.innerHTML = '';
    if (!files || files.length === 0) return;
    files.forEach((file) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <span class="history-icon">📄</span>
        <span class="history-name">${escapeHtml(file.name)}</span>
        <span class="history-time">${relativeTime(file.timestamp)}</span>
      `;
      item.addEventListener('click', async () => {
        await loadStoredData();
        setStatus('Loaded stored data.', 'success');
      });
      historyList.appendChild(item);
    });
  } catch {}
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Collapsible History ---

document.querySelectorAll('.collapsible').forEach((header) => {
  header.addEventListener('click', () => {
    const targetId = header.getAttribute('data-target');
    const target = document.getElementById(targetId);
    const arrow = header.querySelector('.collapse-arrow');
    if (target) {
      const isHidden = target.style.display === 'none' || !target.style.display;
      target.style.display = isHidden ? 'flex' : 'none';
      if (arrow) arrow.classList.toggle('collapsed');
    }
  });
  const targetId = header.getAttribute('data-target');
  const target = document.getElementById(targetId);
  if (target) {
    target.style.display = 'flex';
  }
});

// --- Site Detection ---

async function detectSite() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      document.getElementById('targetUrl').value = tab.url;
      const handler = await chrome.runtime.sendMessage({
        type: 'GET_SITE_HANDLER',
        url: tab.url,
      });
      siteHandlerName = handler || 'Unknown site';
      siteNameEl.textContent = siteHandlerName;
    } else {
      siteNameEl.textContent = 'Unknown site';
    }
  } catch {
    siteNameEl.textContent = 'Unknown site';
  }
}

// --- AutoFill ---

// --- Email Draft ---

document.getElementById('draftEmail').addEventListener('click', () => {
  const job = document.getElementById('jobInfo').value;
  const data = getFieldData();
  const template = generateEmail({ job, ...data });
  document.getElementById('emailOutput').value = template;
});

// --- Settings & Password ---

async function initSettings() {
  try {
    const result = await chrome.storage.local.get('encryptionEnabled');
    encryptionEnabled = !!result.encryptionEnabled;
    document.getElementById('encryptionToggle').checked = encryptionEnabled;
    document.getElementById('passwordSection').style.display = encryptionEnabled ? 'block' : 'none';

    const statusResult = await chrome.runtime.sendMessage({ type: 'GET_PASSWORD_STATUS' });
    hasPassword = statusResult.hasPassword;
    document.getElementById('setPasswordBtn').style.display = hasPassword ? 'none' : 'inline-block';
    document.getElementById('clearPasswordBtn').style.display = hasPassword ? 'inline-block' : 'none';
    if (hasPassword) {
      document.getElementById('passwordStatus').textContent = 'Password is set';
      document.getElementById('passwordStatus').className = 'status success';
    }

    const autoFillResult = await chrome.storage.local.get('autoFillEnabled');
    const autoFill = autoFillResult.autoFillEnabled !== false;
    document.getElementById('autoFillToggle').checked = autoFill;

    const resumeResult = await chrome.runtime.sendMessage({ type: 'GET_RESUME' });
    if (resumeResult) {
      document.getElementById('resumeStatus').textContent = resumeResult.name;
    }
  } catch {}
}

document.getElementById('encryptionToggle').addEventListener('change', async (e) => {
  encryptionEnabled = e.target.checked;
  document.getElementById('passwordSection').style.display = encryptionEnabled ? 'block' : 'none';
  await chrome.storage.local.set({ encryptionEnabled });
});

document.getElementById('setPasswordBtn').addEventListener('click', async () => {
  const pw = document.getElementById('passwordInput').value;
  const confirm = document.getElementById('passwordConfirm').value;
  const statusEl = document.getElementById('passwordStatus');
  if (!pw) { statusEl.textContent = 'Please enter a password'; statusEl.className = 'status error'; return; }
  if (pw !== confirm) { statusEl.textContent = 'Passwords do not match'; statusEl.className = 'status error'; return; }
  const result = await chrome.runtime.sendMessage({ type: 'SET_PASSWORD', password: pw });
  if (result.success) {
    hasPassword = true;
    document.getElementById('setPasswordBtn').style.display = 'none';
    document.getElementById('clearPasswordBtn').style.display = 'inline-block';
    statusEl.textContent = 'Password set successfully';
    statusEl.className = 'status success';
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordConfirm').value = '';
  } else {
    statusEl.textContent = 'Failed to set password';
    statusEl.className = 'status error';
  }
});

document.getElementById('clearPasswordBtn').addEventListener('click', async () => {
  const result = await chrome.runtime.sendMessage({ type: 'CLEAR_PASSWORD' });
  if (result.success) {
    hasPassword = false;
    document.getElementById('setPasswordBtn').style.display = 'inline-block';
    document.getElementById('clearPasswordBtn').style.display = 'none';
    document.getElementById('passwordStatus').textContent = 'Password cleared';
    document.getElementById('passwordStatus').className = 'status info';
  }
});

document.getElementById('uploadResumeBtn').addEventListener('click', () => {
  document.getElementById('resumeFileInput').click();
});

document.getElementById('resumeFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result.split(',')[1];
    const result = await chrome.runtime.sendMessage({
      type: 'STORE_RESUME',
      name: file.name,
      blob: base64,
    });
    if (result.success) {
      document.getElementById('resumeStatus').textContent = file.name;
      setStatus('Resume uploaded', 'success');
    }
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

document.getElementById('autoFillToggle').addEventListener('change', async (e) => {
  await chrome.storage.local.set({ autoFillEnabled: e.target.checked });
});

// --- Updated AutoFill (with resume) ---

document.getElementById('fillForm').addEventListener('click', async () => {
  const data = getFieldData();
  try {
    const resumeResult = await chrome.runtime.sendMessage({ type: 'GET_RESUME' });
    if (resumeResult) {
      data.resumeBlob = resumeResult.blob;
      data.resumeName = resumeResult.name;
    }
    const autoFill = document.getElementById('autoFillToggle').checked;
    data.autoFill = autoFill;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setStatus('No active tab found.', 'error');
      return;
    }
    const result = await chrome.tabs.sendMessage(tab.id, {
      type: 'FILL_FORM',
      data,
    });
    const handler = result.handler || siteHandlerName || 'the page';
    fillResultEl.textContent = `Filled ${result.filled}/${result.total} fields on ${handler}`;
    setStatus(`Auto-filled ${result.filled} fields.`, 'success');
  } catch (err) {
    setStatus('Error: reload the page and try again.', 'error');
    fillResultEl.textContent = '';
  }
});

// --- LinkedIn Filter Dashboard ---

async function initLinkedInFilter() {
  try {
    const settings = await LinkedInStorage.getSettings();
    document.getElementById('linkedinFilterToggle').checked = settings.isFilterActive;
    document.getElementById('linkedinKeywords').value = settings.keywords.join(', ');
    document.getElementById('linkedinHighlightColor').value = settings.highlightColor;
  } catch {}
}

document.getElementById('linkedinFilterToggle').addEventListener('change', async (e) => {
  const settings = await LinkedInStorage.getSettings();
  settings.isFilterActive = e.target.checked;
  await LinkedInStorage.saveSettings(settings);
  document.getElementById('linkedinFilterStatus').textContent = e.target.checked ? 'Filter active' : 'Filter paused';
  document.getElementById('linkedinFilterStatus').className = 'status ' + (e.target.checked ? 'success' : 'info');
});

let keywordSaveTimer = null;
document.getElementById('linkedinKeywords').addEventListener('input', async () => {
  if (keywordSaveTimer) clearTimeout(keywordSaveTimer);
  keywordSaveTimer = setTimeout(async () => {
    const raw = document.getElementById('linkedinKeywords').value;
    const keywords = raw.split(',').map(k => k.trim()).filter(Boolean);
    const settings = await LinkedInStorage.getSettings();
    settings.keywords = keywords;
    await LinkedInStorage.saveSettings(settings);
    document.getElementById('linkedinFilterStatus').textContent = `Keywords saved (${keywords.length})`;
    document.getElementById('linkedinFilterStatus').className = 'status success';
  }, 800);
});

document.getElementById('linkedinHighlightColor').addEventListener('input', async (e) => {
  const settings = await LinkedInStorage.getSettings();
  settings.highlightColor = e.target.value;
  await LinkedInStorage.saveSettings(settings);
});

// --- Saved Jobs Dashboard ---

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadSavedJobs() {
  try {
    const jobs = await LinkedInStorage.getSavedJobs();
    const list = document.getElementById('savedJobsList');
    const count = document.getElementById('savedJobsCount');
    count.textContent = `(${jobs.length})`;
    list.innerHTML = '';
    if (jobs.length === 0) {
      list.innerHTML = '<p style="color:var(--text-secondary);padding:8px;">No jobs saved yet.</p>';
      return;
    }
    jobs.forEach((job) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const date = job.savedAt ? new Date(job.savedAt).toLocaleDateString() : '';
      const kw = (job.matchedKeywords || []).join(', ');
      item.innerHTML = `
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:13px;">${escapeHtml(job.authorName || 'Unknown')}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin:2px 0;">
            ${escapeHtml((job.contentPreview || '').slice(0, 80))}${(job.contentPreview || '').length > 80 ? '...' : ''}
          </div>
          <div style="font-size:10px;color:var(--text-secondary);">
            ${date} ${kw ? '· ' + escapeHtml(kw) : ''}
          </div>
        </div>
        <div style="display:flex;gap:4px;align-items:center;">
          <button class="btn small open-job-btn" data-url="${escapeHtml(job.url || '')}" style="padding:2px 8px;font-size:11px;">Open</button>
          <button class="btn small remove-job-btn" data-id="${escapeHtml(job.id)}" style="padding:2px 8px;font-size:11px;background:var(--accent-red);color:#fff;">✕</button>
        </div>
      `;
      list.appendChild(item);
    });

    list.querySelectorAll('.open-job-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        chrome.tabs.create({ url: btn.dataset.url });
      });
    });
    list.querySelectorAll('.remove-job-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await LinkedInStorage.removeJob(btn.dataset.id);
        loadSavedJobs();
      });
    });
  } catch {}
}

document.getElementById('exportJSONBtn').addEventListener('click', async () => {
  const jobs = await LinkedInStorage.getSavedJobs();
  const json = LinkedInStorage.exportJobsJSON(jobs);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved-jobs.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('exportCSVBtn').addEventListener('click', async () => {
  const jobs = await LinkedInStorage.getSavedJobs();
  const csv = LinkedInStorage.exportJobsCSV(jobs);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved-jobs.csv';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('clearJobsBtn').addEventListener('click', async () => {
  if (!confirm('Clear all saved jobs?')) return;
  await LinkedInStorage.clearAllJobs();
  loadSavedJobs();
});

// --- Init ---

(async function init() {
  await initTheme();
  await loadStoredData();
  await loadRecentFiles();
  await detectSite();
  await initSettings();
  await initLinkedInFilter();
  await loadSavedJobs();
})();
