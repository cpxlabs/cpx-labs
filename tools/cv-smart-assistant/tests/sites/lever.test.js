const lever = require('../../src/sites/lever');

describe('Lever site handler', () => {
  test('name is Lever', () => {
    expect(lever.name).toBe('Lever');
  });

  test('matches returns true for lever.co URLs', () => {
    expect(lever.matches('https://jobs.lever.co/acme')).toBe(true);
    expect(lever.matches('http://lever.co/careers')).toBe(true);
  });

  test('matches returns false for non-lever URLs', () => {
    expect(lever.matches('https://google.com')).toBe(false);
  });

  test('fill maps name, email, phone correctly', async () => {
    document.body.innerHTML = `
      <input name="name">
      <input name="email">
      <input name="phone">
      <input name="urls[LinkedIn]">
      <input name="urls[GitHub]">
    `;
    const result = await lever.fill({
      name: 'Jane Smith',
      email: 'jane@test.com',
      phone: '555-1234',
      linkedin: 'linkedin.com/in/jane',
      github: 'github.com/jane',
    });
    expect(result.filled).toBe(5);
    expect(document.querySelector('input[name="name"]').value).toBe('Jane Smith');
    expect(document.querySelector('input[name="urls[LinkedIn]"]').value).toBe('linkedin.com/in/jane');
  });

  test('fill with missing fields returns fallback total', async () => {
    document.body.innerHTML = '<input name="unrelated">';
    const result = await lever.fill({ name: 'Test' });
    expect(result.total).toBe(5);
  });
});
