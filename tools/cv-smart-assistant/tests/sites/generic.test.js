const generic = require('../../src/sites/generic');

describe('Generic site handler', () => {
  test('name is Generic', () => {
    expect(generic.name).toBe('Generic');
  });

  test('matches returns true for any URL', () => {
    expect(generic.matches('http://example.com')).toBe(true);
    expect(generic.matches('https://linkedin.com/jobs')).toBe(true);
    expect(generic.matches('')).toBe(true);
  });

  test('fill with matching fields', () => {
    document.body.innerHTML = `
      <input name="full_name">
      <input name="email">
      <input name="phone">
      <input name="linkedin_url">
      <input name="github_handle">
    `;
    const data = {
      name: 'John Doe',
      email: 'john@test.com',
      phone: '555-1234',
      linkedin: 'john-doe',
      github: 'johndoe',
    };
    const result = generic.fill(data);
    expect(result.filled).toBe(5);
    expect(result.total).toBe(5);
    expect(document.querySelector('input[name="full_name"]').value).toBe('John Doe');
    expect(document.querySelector('input[name="email"]').value).toBe('john@test.com');
  });

  test('fill with no matching fields returns filled 0', () => {
    document.body.innerHTML = '<input name="unrelated">';
    const data = {
      name: 'John',
      email: 'john@test.com',
      phone: '555-1234',
      linkedin: '',
      github: '',
    };
    const result = generic.fill(data);
    expect(result.filled).toBe(0);
    expect(result.total).toBe(5);
  });
});
