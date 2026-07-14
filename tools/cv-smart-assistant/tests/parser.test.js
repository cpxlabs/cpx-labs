const { parseCVText } = require('../src/lib/parser');

describe('parseCVText', () => {
  test('extracts name from first non-empty line', () => {
    const result = parseCVText('John Doe\nSome other text');
    expect(result.name).toBe('John Doe');
  });

  test('returns empty name for empty text', () => {
    const result = parseCVText('');
    expect(result.name).toBe('');
  });

  test('extracts email', () => {
    const text = 'Contact: john.doe@example.com';
    const result = parseCVText(text);
    expect(result.email).toBe('john.doe@example.com');
  });

  test('returns empty email when none present', () => {
    const result = parseCVText('No email here');
    expect(result.email).toBe('');
  });

  test('extracts phone number', () => {
    const text = 'Phone: +1 (555) 123-4567';
    const result = parseCVText(text);
    expect(result.phone).toBe('+1 (555) 123-4567');
  });

  test('extracts phone with various formats', () => {
    const texts = [
      'Call: 555-123-4567',
      'Tel: +44 20 7123 4567',
      'Phone: (123) 456-7890',
    ];
    texts.forEach(t => {
      expect(parseCVText(t).phone).toBeTruthy();
    });
  });

  test('extracts German phone number', () => {
    const result = parseCVText('Tel: +49 30 123456');
    expect(result.phone).toBe('+49 30 123456');
  });

  test('extracts French phone number', () => {
    const result = parseCVText('Tél: +33 6 12 34 56 78');
    expect(result.phone).toBe('+33 6 12 34 56 78');
  });

  test('extracts Japanese phone number', () => {
    const result = parseCVText('Phone: +81 3 1234 5678');
    expect(result.phone).toBe('+81 3 1234 5678');
  });

  test('extracts LinkedIn URL', () => {
    const text = 'linkedin.com/in/johndoe';
    const result = parseCVText(text);
    expect(result.linkedin).toBe('linkedin.com/in/johndoe');
  });

  test('extracts LinkedIn URL with https', () => {
    const text = 'https://linkedin.com/in/johndoe';
    const result = parseCVText(text);
    expect(result.linkedin).toBe('linkedin.com/in/johndoe');
  });

  test('extracts GitHub URL', () => {
    const text = 'github.com/johndoe';
    const result = parseCVText(text);
    expect(result.github).toBe('github.com/johndoe');
  });

  test('truncates name to 50 chars', () => {
    const longName = 'A'.repeat(100);
    const result = parseCVText(longName);
    expect(result.name.length).toBe(50);
  });

  test('extracts skills from CV', () => {
    const text = `Maria Lopez
    Software Developer
    maria@example.com
    Skills: JavaScript, Python, React, Docker`;
    const result = parseCVText(text);
    expect(result.skills).toContain('JavaScript');
    expect(result.skills).toContain('Python');
    expect(result.skills).toContain('React');
    expect(result.skills).toContain('Docker');
  });

  test('extracts education from CV', () => {
    const text = `Anna Schmidt
    anna@example.com
    Education
    Bachelor of Science in Computer Science
    University of Berlin`;
    const result = parseCVText(text);
    expect(result.education.length).toBeGreaterThan(0);
    const edu = result.education.join(' ');
    expect(edu).toMatch(/Bachelor/);
    expect(edu).toMatch(/University/);
  });

  test('extracts experience from CV', () => {
    const text = `Carlos Rivera
    carlos@example.com
    Senior Software Engineer at Acme Corp
    5 years of experience in full-stack development`;
    const result = parseCVText(text);
    expect(result.experience.length).toBeGreaterThan(0);
    const exp = result.experience.join(' ');
    expect(exp).toMatch(/Software Engineer/);
    expect(exp).toMatch(/5 years of experience/);
  });

  test('extracts name with accented characters', () => {
    const text = 'José María García\nDeveloper\njose@example.com';
    const result = parseCVText(text);
    expect(result.name).toBe('José María García');
  });

  test('detects French language headers', () => {
    const text = `Marie Curie
    marie@example.com
    Expérience professionnelle
    Développeur
    Formation
    Université de Paris`;
    const result = parseCVText(text);
    // parseCVText returns detected language only through internal use,
    // but should still correctly parse the CV
    expect(result.name).toBe('Marie Curie');
    expect(result.email).toBe('marie@example.com');
  });

  test('full CV parse', () => {
    const cv = `Jane Smith
    Software Engineer
    jane.smith@company.com
    +1 555-987-6543
    linkedin.com/in/janesmith
    github.com/janesmith`;

    const result = parseCVText(cv);
    expect(result).toEqual({
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1 555-987-6543',
      linkedin: 'linkedin.com/in/janesmith',
      github: 'github.com/janesmith',
      skills: [],
      education: [],
      experience: ['Software Engineer'],
    });
  });
});
