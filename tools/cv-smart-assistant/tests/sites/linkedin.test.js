const linkedin = require('../../src/sites/linkedin');

describe('LinkedIn site handler', () => {
  test('name is LinkedIn', () => {
    expect(linkedin.name).toBe('LinkedIn');
  });

  test('matches returns true for linkedin.com URLs', () => {
    expect(linkedin.matches('https://www.linkedin.com/jobs')).toBe(true);
    expect(linkedin.matches('https://linkedin.com/in/johndoe')).toBe(true);
    expect(linkedin.matches('http://linkedin.com')).toBe(true);
  });

  test('matches returns false for non-linkedin URLs', () => {
    expect(linkedin.matches('https://example.com')).toBe(false);
    expect(linkedin.matches('https://google.com')).toBe(false);
    expect(linkedin.matches('')).toBe(false);
  });

  test('fill with LinkedIn-style form', async () => {
    document.body.innerHTML = `
      <input name="name">
      <input name="email">
      <input type="tel">
      <textarea name="comment" placeholder="Cover letter"></textarea>
    `;
    const data = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 555-987-6543',
      coverLetter: 'I am interested in this position',
    };
    const result = await linkedin.fill(data);
    expect(result.filled).toBe(4);
    expect(document.querySelector('input[name="name"]').value).toBe('Jane Smith');
    expect(document.querySelector('input[name="email"]').value).toBe('jane@example.com');
    expect(document.querySelector('input[type="tel"]').value).toBe('+1 555-987-6543');
    expect(document.querySelector('textarea').value).toBe('I am interested in this position');
  });
});
