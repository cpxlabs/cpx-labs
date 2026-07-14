/**
 * @jest-environment node
 */
const { encryptData, decryptData } = require('../src/lib/storage');

describe('encryptData / decryptData standalone', () => {
  test('encrypt then decrypt returns original data', async () => {
    const original = { name: 'Test User', email: 'test@example.com', phone: '+1 555-0000' };
    const encrypted = await encryptData(original, 'strong-password');
    const decrypted = await decryptData(encrypted, 'strong-password');
    expect(decrypted).toEqual(original);
  });

  test('different passwords produce different ciphertexts', async () => {
    const data = { msg: 'hello' };
    const enc1 = await encryptData(data, 'password-a');
    const enc2 = await encryptData(data, 'password-b');
    expect(enc1.salt).not.toEqual(enc2.salt);
    expect(enc1.iv).not.toEqual(enc2.iv);
    expect(enc1.data).not.toEqual(enc2.data);
  });

  test('wrong password fails to decrypt', async () => {
    const encrypted = await encryptData({ foo: 'bar' }, 'correct-pw');
    await expect(decryptData(encrypted, 'wrong-pw')).rejects.toThrow();
  });

  test('encrypted data has salt (16 bytes), iv (12 bytes), data (present)', async () => {
    const encrypted = await encryptData('some data', 'pw');
    expect(encrypted.salt).toHaveLength(16);
    expect(encrypted.iv).toHaveLength(12);
    expect(encrypted.data.length).toBeGreaterThan(0);
  });

  test('decrypt with correct password after JSON roundtrip', async () => {
    const original = { key: 'value', nested: { arr: [1, 2, 3] } };
    const encrypted = await encryptData(original, 'roundtrip-pw');
    const serialized = JSON.parse(JSON.stringify(encrypted));
    const decrypted = await decryptData(serialized, 'roundtrip-pw');
    expect(decrypted).toEqual(original);
  });

  test('encrypting same data twice produces different output', async () => {
    const data = { test: 'same data' };
    const enc1 = await encryptData(data, 'mypw');
    const enc2 = await encryptData(data, 'mypw');
    expect(enc1.iv).not.toEqual(enc2.iv);
    expect(enc1.salt).not.toEqual(enc2.salt);
    expect(enc1.data).not.toEqual(enc2.data);
  });
});
