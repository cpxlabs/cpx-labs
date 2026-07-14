/**
 * @jest-environment node
 */
const { saveData, loadData, saveRecent, loadRecent, clearData, saveTheme, loadTheme, encryptData, decryptData } = require('../src/lib/storage');

describe('Storage API', () => {
  beforeEach(async () => {
    await clearData();
  });

  describe('saveData / loadData', () => {
    test('saves and loads simple data', async () => {
      const data = { name: 'John', email: 'john@test.com' };
      await saveData(data);
      const loaded = await loadData();
      expect(loaded.data).toEqual(data);
      expect(loaded.timestamp).toBeDefined();
    });

    test('loadData returns null when empty', async () => {
      const loaded = await loadData();
      expect(loaded).toBeNull();
    });

    test('overwrites existing data', async () => {
      await saveData({ name: 'First' });
      await saveData({ name: 'Second' });
      const loaded = await loadData();
      expect(loaded.data.name).toBe('Second');
    });
  });

  describe('saveRecent / loadRecent', () => {
    test('adds items to recent list', async () => {
      await saveRecent({ name: 'a.pdf', timestamp: 1 });
      await saveRecent({ name: 'b.pdf', timestamp: 2 });
      const recent = await loadRecent();
      expect(recent).toHaveLength(2);
      expect(recent[0].name).toBe('b.pdf');
    });

    test('caps at 10 items', async () => {
      for (let i = 0; i < 15; i++) {
        await saveRecent({ name: `f${i}.pdf`, timestamp: i });
      }
      const recent = await loadRecent();
      expect(recent).toHaveLength(10);
      expect(recent[0].name).toBe('f14.pdf');
    });

    test('returns empty array when no recent files', async () => {
      const recent = await loadRecent();
      expect(recent).toEqual([]);
    });
  });

  describe('clearData', () => {
    test('clears all stored data', async () => {
      await saveData({ name: 'test' });
      await saveRecent({ name: 'test.pdf' });
      await clearData();
      expect(await loadData()).toBeNull();
      expect(await loadRecent()).toEqual([]);
    });
  });

  describe('saveTheme / loadTheme', () => {
    test('default theme is false (light)', async () => {
      expect(await loadTheme()).toBe(false);
    });

    test('saves and loads theme preference', async () => {
      await saveTheme(true);
      expect(await loadTheme()).toBe(true);
      await saveTheme(false);
      expect(await loadTheme()).toBe(false);
    });
  });

  describe('encryptData / decryptData', () => {
    test('encrypts and decrypts data', async () => {
      const original = { name: 'Alice', email: 'alice@test.com' };
      const encrypted = await encryptData(original, 'password');
      expect(encrypted).toHaveProperty('salt');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('data');
      expect(encrypted.salt).toHaveLength(16);
      expect(encrypted.iv).toHaveLength(12);

      const decrypted = await decryptData(encrypted, 'password');
      expect(decrypted).toEqual(original);
    });

    test('wrong password fails', async () => {
      const encrypted = await encryptData('secret', 'correct');
      await expect(decryptData(encrypted, 'wrong')).rejects.toThrow();
    });

    test('each encryption produces unique output', async () => {
      const data = { msg: 'hello' };
      const a = await encryptData(data, 'pw');
      const b = await encryptData(data, 'pw');
      expect(a.iv).not.toEqual(b.iv);
      expect(a.salt).not.toEqual(b.salt);
    });
  });

  describe('password-protected save/load', () => {
    test('saves with password and loads with correct password', async () => {
      await saveData({ name: 'Secret' }, 'mypassword');
      const loaded = await loadData('mypassword');
      expect(loaded.data).toEqual({ name: 'Secret' });
    });

    test('load without password on encrypted data returns null', async () => {
      await saveData({ name: 'Hidden' }, 'pw');
      const loaded = await loadData();
      expect(loaded).toBeNull();
    });

    test('load with wrong password returns null', async () => {
      await saveData({ name: 'Hidden' }, 'correct');
      const loaded = await loadData('wrong');
      expect(loaded).toBeNull();
    });
  });
});
