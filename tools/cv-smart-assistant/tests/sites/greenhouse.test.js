const greenhouse = require('../../src/sites/greenhouse');

describe('Greenhouse site handler', () => {
  test('name is Greenhouse', () => {
    expect(greenhouse.name).toBe('Greenhouse');
  });

  test('matches returns true for greenhouse.io URLs', () => {
    expect(greenhouse.matches('https://boards.greenhouse.io/acme')).toBe(true);
    expect(greenhouse.matches('http://greenhouse.io/jobs')).toBe(true);
  });

  test('matches returns false for non-greenhouse URLs', () => {
    expect(greenhouse.matches('https://google.com')).toBe(false);
    expect(greenhouse.matches('https://linkedin.com')).toBe(false);
  });

  test('fill maps first_name and last_name from data.name', async () => {
    document.body.innerHTML = `
      <input name="first_name">
      <input name="last_name">
      <input name="email">
    `;
    const result = await greenhouse.fill({
      name: 'John Doe',
      email: 'john@test.com',
    });
    expect(result.filled).toBe(3);
    expect(document.querySelector('input[name="first_name"]').value).toBe('John');
    expect(document.querySelector('input[name="last_name"]').value).toBe('Doe');
    expect(document.querySelector('input[name="email"]').value).toBe('john@test.com');
  });

  test('fill with empty data does not crash', async () => {
    document.body.innerHTML = '<input name="first_name">';
    const result = await greenhouse.fill({});
    expect(result.filled).toBe(0);
  });
});
