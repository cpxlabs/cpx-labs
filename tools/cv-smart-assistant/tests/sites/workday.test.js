const workday = require('../../src/sites/workday');

describe('Workday site handler', () => {
  test('name is Workday', () => {
    expect(workday.name).toBe('Workday');
  });

  test('matches myworkdayjobs.com URLs', () => {
    expect(workday.matches('https://acme.myworkdayjobs.com/careers')).toBe(true);
    expect(workday.matches('https://wd5.myworkdayjobs.com/acme')).toBe(true);
  });

  test('returns false for non-workday URLs', () => {
    expect(workday.matches('https://google.com')).toBe(false);
    expect(workday.matches('https://linkedin.com')).toBe(false);
  });

  test('fill uses data-automation-id attributes', async () => {
    document.body.innerHTML = `
      <input data-automation-id="contactInfo-name">
      <input data-automation-id="email">
      <input data-automation-id="phone">
    `;
    const result = await workday.fill({
      name: 'Alice',
      email: 'alice@test.com',
      phone: '555-0000',
    });
    expect(result.filled).toBe(3);
    expect(document.querySelector('[data-automation-id="contactInfo-name"]').value).toBe('Alice');
    expect(document.querySelector('[data-automation-id="email"]').value).toBe('alice@test.com');
  });

  test('fill matches by various field attributes', async () => {
    document.body.innerHTML = `
      <input name="email" placeholder="Email">
      <input aria-label="Phone">
    `;
    const result = await workday.fill({
      name: '',
      email: 'bob@test.com',
      phone: '555-1111',
    });
    expect(result.filled).toBe(2);
  });

  test('fill with empty data', async () => {
    document.body.innerHTML = '<input name="email">';
    const result = await workday.fill({});
    expect(result.filled).toBe(0);
  });
});
