const { generateEmail } = require('../src/lib/templates');

describe('generateEmail', () => {
  const fullData = {
    job: 'Software Engineer at Acme',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555-1234',
    linkedin: 'linkedin.com/in/janedoe',
  };

  test('happy path with all fields filled', () => {
    const result = generateEmail(fullData);
    expect(result).toContain('Software Engineer at Acme');
    expect(result).toContain('Jane Doe');
    expect(result).toContain('jane@example.com');
    expect(result).toContain('+1 555-1234');
    expect(result).toContain('linkedin.com/in/janedoe');
  });

  test('missing job title falls back to default placeholder', () => {
    const { job, ...rest } = fullData;
    const result = generateEmail(rest);
    expect(result).toContain('[Target Role / Company]');
  });

  test('missing name falls back to default placeholder', () => {
    const { name, ...rest } = fullData;
    const result = generateEmail(rest);
    expect(result).toContain('[Your Name]');
  });

  test('missing email falls back to default placeholder', () => {
    const { email, ...rest } = fullData;
    const result = generateEmail(rest);
    expect(result).toContain('[Your Email]');
  });

  test('missing phone falls back to default placeholder', () => {
    const { phone, ...rest } = fullData;
    const result = generateEmail(rest);
    expect(result).toContain('[Your Phone]');
  });

  test('missing linkedin falls back to default placeholder', () => {
    const { linkedin, ...rest } = fullData;
    const result = generateEmail(rest);
    expect(result).toContain('[Your LinkedIn]');
  });

  test('missing multiple fields all fall back to placeholders', () => {
    const result = generateEmail({});
    expect(result).toContain('[Target Role / Company]');
    expect(result).toContain('[Your Name]');
    expect(result).toContain('[Your Email]');
    expect(result).toContain('[Your Phone]');
    expect(result).toContain('[Your LinkedIn]');
  });

  test('partial data only some fields provided', () => {
    const result = generateEmail({ name: 'Alice', job: 'Engineer' });
    expect(result).toContain('Engineer');
    expect(result).toContain('Alice');
    expect(result).toContain('[Your Email]');
    expect(result).toContain('[Your Phone]');
    expect(result).toContain('[Your LinkedIn]');
  });

  test('contains Dear Hiring Manager', () => {
    const result = generateEmail(fullData);
    expect(result).toContain('Dear Hiring Manager');
  });

  test('contains Best regards', () => {
    const result = generateEmail(fullData);
    expect(result).toContain('Best regards');
  });

  test('lines are separated by newlines', () => {
    const result = generateEmail(fullData);
    const lines = result.split('\n');
    expect(lines.length).toBeGreaterThan(1);
    expect(result).toMatch(/\n/);
  });
});
