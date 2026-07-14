const DEFAULT_SETTINGS = {
  keywords: ['remoto', 'home office', 'trabalho remoto', '100% remoto'],
  isFilterActive: true,
  highlightColor: '#e6f4ea',
};

const STORAGE_KEYS = {
  SETTINGS: 'linkedin_userSettings',
  JOBS: 'linkedin_savedJobs',
};

async function getSettings() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...(result[STORAGE_KEYS.SETTINGS] || {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

async function saveSettings(settings) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    return true;
  } catch {
    return false;
  }
}

async function getSavedJobs() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.JOBS);
    return result[STORAGE_KEYS.JOBS] || [];
  } catch {
    return [];
  }
}

async function saveJob(job) {
  try {
    const jobs = await getSavedJobs();
    const exists = jobs.some((j) => j.id === job.id);
    if (exists) return false;
    job.savedAt = new Date().toISOString();
    jobs.unshift(job);
    await chrome.storage.local.set({ [STORAGE_KEYS.JOBS]: jobs });
    return true;
  } catch {
    return false;
  }
}

async function removeJob(jobId) {
  try {
    const jobs = await getSavedJobs();
    const filtered = jobs.filter((j) => j.id !== jobId);
    await chrome.storage.local.set({ [STORAGE_KEYS.JOBS]: filtered });
    return true;
  } catch {
    return false;
  }
}

async function clearAllJobs() {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.JOBS]: [] });
    return true;
  } catch {
    return false;
  }
}

function exportJobsJSON(jobs) {
  return JSON.stringify(jobs, null, 2);
}

function exportJobsCSV(jobs) {
  const header = 'id,url,authorName,contentPreview,savedAt,matchedKeywords';
  const rows = jobs.map((j) => {
    const keywords = (j.matchedKeywords || []).join(';');
    return `"${j.id}","${j.url}","${(j.authorName || '').replace(/"/g, '""')}","${(j.contentPreview || '').replace(/"/g, '""')}","${j.savedAt}","${keywords}"`;
  });
  return [header, ...rows].join('\n');
}

const LinkedInStorage = { getSettings, saveSettings, getSavedJobs, saveJob, removeJob, clearAllJobs, exportJobsJSON, exportJobsCSV, DEFAULT_SETTINGS };

if (typeof window !== 'undefined') {
  window.LinkedInStorage = LinkedInStorage;
}
if (typeof module !== 'undefined') {
  module.exports = LinkedInStorage;
}
