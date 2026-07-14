/**
 * @jest-environment node
 */
const { saveData, loadData, saveRecent, loadRecent, clearData, saveTheme, loadTheme, encryptData, decryptData } = require('../../src/lib/storage');

describe('Storage', () => {
  beforeEach(async () => {
    await clearData();
  });

  test('saveData + loadData roundtrip', async () => {
    const data = { name: 'John', email: 'john@test.com' };
    await saveData(data);
    const loaded = await loadData();
    expect(loaded).not.toBeNull();
    expect(loaded.data).toEqual(data);
    expect(loaded.timestamp).toBeDefined();
    expect(typeof loaded.timestamp).toBe('number');
  });

  test('loadData returns null when no data saved', async () => {
    const loaded = await loadData();
    expect(loaded).toBeNull();
  });

  test('saveRecent adds to list', async () => {
    await saveRecent({ name: 'file1.pdf' });
    const recent = await loadRecent();
    expect(recent).toHaveLength(1);
    expect(recent[0].name).toBe('file1.pdf');
    expect(recent[0].timestamp).toBeDefined();
  });

  test('saveRecent caps at 10 items', async () => {
    for (let i = 0; i < 15; i++) {
      await saveRecent({ name: `file${i}.pdf` });
    }
    const recent = await loadRecent();
    expect(recent).toHaveLength(10);
  });

  test('clearData clears everything', async () => {
    await saveData({ name: 'test' });
    await saveRecent({ name: 'test.pdf' });
    await clearData();
    const data = await loadData();
    const recent = await loadRecent();
    expect(data).toBeNull();
    expect(recent).toEqual([]);
  });

  test('saveTheme + loadTheme', async () => {
    expect(await loadTheme()).toBe(false);
    await saveTheme(true);
    expect(await loadTheme()).toBe(true);
    await saveTheme(false);
    expect(await loadTheme()).toBe(false);
  });
});

describe('encryptData / decryptData', () => {
  test('encryptData returns salt, iv, data with correct types', async () => {
    const result = await encryptData({ foo: 'bar' }, 'password123');
    expect(result).toHaveProperty('salt');
    expect(result).toHaveProperty('iv');
    expect(result).toHaveProperty('data');
    expect(Array.isArray(result.salt)).toBe(true);
    expect(Array.isArray(result.iv)).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.salt).toHaveLength(16);
    expect(result.iv).toHaveLength(12);
    expect(result.data.length).toBeGreaterThan(0);
    result.salt.forEach(v => expect(typeof v).toBe('number'));
    result.iv.forEach(v => expect(typeof v).toBe('number'));
    result.data.forEach(v => expect(typeof v).toBe('number'));
  });

  test('decryptData recovers original data from encrypted output', async () => {
    const original = { name: 'Alice', email: 'alice@test.com', nested: { x: 1 } };
    const encrypted = await encryptData(original, 'mypassword');
    const decrypted = await decryptData(encrypted, 'mypassword');
    expect(decrypted).toEqual(original);
  });

  test('decryptData with wrong password rejects', async () => {
    const original = { name: 'Bob' };
    const encrypted = await encryptData(original, 'correctpw');
    await expect(decryptData(encrypted, 'wrongpw')).rejects.toThrow();
  });

  test('saveData with password + loadData with password roundtrip', async () => {
    const data = { name: 'Encrypted User', email: 'secret@test.com' };
    await saveData(data, 'secret123');
    const loaded = await loadData('secret123');
    expect(loaded).not.toBeNull();
    expect(loaded.data).toEqual(data);
    expect(loaded.timestamp).toBeDefined();
  });

  test('saveData with password + loadData without password returns null', async () => {
    await saveData({ name: 'Hidden' }, 'secret123');
    const loaded = await loadData();
    expect(loaded).toBeNull();
  });

  test('saveData with password + loadData with wrong password returns null', async () => {
    await saveData({ name: 'Hidden' }, 'secret123');
    const loaded = await loadData('wrongpassword');
    expect(loaded).toBeNull();
  });
});
