/**
 * @jest-environment node
 */
const { getSettings, saveSettings, getSavedJobs, saveJob, removeJob, clearAllJobs, exportJobsJSON, exportJobsCSV, DEFAULT_SETTINGS } = require('../src/lib/linkedinStorage');

const mockStorage = {};
global.chrome = {
  storage: {
    local: {
      get: jest.fn((keys, cb) => {
        const result = {};
        const ks = Array.isArray(keys) ? keys : [keys];
        for (const k of ks) result[k] = mockStorage[k] !== undefined ? mockStorage[k] : null;
        if (cb) cb(result);
        return Promise.resolve(result);
      }),
      set: jest.fn((items, cb) => {
        Object.assign(mockStorage, items);
        if (cb) cb();
      }),
    },
  },
};

beforeEach(() => {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  jest.clearAllMocks();
});

describe('linkedinStorage', () => {
  describe('getSettings / saveSettings', () => {
    test('returns defaults when no settings stored', async () => {
      const s = await getSettings();
      expect(s.isFilterActive).toBe(true);
      expect(s.keywords).toContain('remoto');
    });

    test('saves and loads custom settings', async () => {
      await saveSettings({ keywords: ['python', 'react'], isFilterActive: false, highlightColor: '#fff' });
      const s = await getSettings();
      expect(s.keywords).toEqual(['python', 'react']);
      expect(s.isFilterActive).toBe(false);
      expect(s.highlightColor).toBe('#fff');
    });

    test('merges with defaults for partial updates', async () => {
      await saveSettings({ isFilterActive: false });
      const s = await getSettings();
      expect(s.isFilterActive).toBe(false);
      expect(s.keywords).toEqual(DEFAULT_SETTINGS.keywords);
    });
  });

  describe('saveJob / getSavedJobs', () => {
    test('saves a job and retrieves it', async () => {
      const saved = await saveJob({ id: 'urn:li:activity:123', authorName: 'Recruiter', contentPreview: 'Remote job' });
      expect(saved).toBe(true);
      const jobs = await getSavedJobs();
      expect(jobs).toHaveLength(1);
      expect(jobs[0].id).toBe('urn:li:activity:123');
      expect(jobs[0].savedAt).toBeDefined();
    });

    test('does not save duplicate', async () => {
      await saveJob({ id: 'urn:li:activity:123' });
      const saved = await saveJob({ id: 'urn:li:activity:123' });
      expect(saved).toBe(false);
      const jobs = await getSavedJobs();
      expect(jobs).toHaveLength(1);
    });

    test('prepends new jobs to the list', async () => {
      await saveJob({ id: 'a' });
      await saveJob({ id: 'b' });
      const jobs = await getSavedJobs();
      expect(jobs[0].id).toBe('b');
    });
  });

  describe('removeJob', () => {
    test('removes a specific job', async () => {
      await saveJob({ id: 'a' });
      await saveJob({ id: 'b' });
      await removeJob('a');
      const jobs = await getSavedJobs();
      expect(jobs).toHaveLength(1);
      expect(jobs[0].id).toBe('b');
    });
  });

  describe('clearAllJobs', () => {
    test('clears all saved jobs', async () => {
      await saveJob({ id: 'a' });
      await saveJob({ id: 'b' });
      await clearAllJobs();
      const jobs = await getSavedJobs();
      expect(jobs).toEqual([]);
    });
  });

  describe('exportJobsJSON', () => {
    test('exports jobs as formatted JSON', () => {
      const jobs = [{ id: 'a', authorName: 'X', contentPreview: 'Y', savedAt: '2026-01-01', matchedKeywords: ['remote'] }];
      const json = exportJobsJSON(jobs);
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('a');
    });
  });

  describe('exportJobsCSV', () => {
    test('exports jobs as CSV with header', () => {
      const jobs = [{ id: 'a', url: 'https://linkedin.com', authorName: 'X', contentPreview: 'Y', savedAt: '2026-01-01', matchedKeywords: ['remote'] }];
      const csv = exportJobsCSV(jobs);
      expect(csv).toContain('id,url,authorName,contentPreview,savedAt,matchedKeywords');
      expect(csv).toContain('"a"');
      expect(csv).toContain('"remote"');
    });
  });
});
