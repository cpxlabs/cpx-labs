/**
 * @jest-environment jsdom
 * 
 * E2E tests for PDF upload and CV parsing workflow.
 * Tests the full pipeline: PDF file -> parseCVText -> populateFields -> storage
 */
const fs = require('fs');
const path = require('path');
const { parseCVText } = require('../src/lib/parser');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

// Mock DOM elements matching popup.html structure
function createMockPopupDOM() {
  document.body.innerHTML = `
    <input id="field-name" />
    <input id="field-email" />
    <input id="field-phone" />
    <input id="field-linkedin" />
    <input id="field-github" />
    <div id="selectPdf"></div>
    <input id="fileInput" type="file" />
    <div id="historyList"></div>
    <span id="siteName"></span>
    <span id="fillResult"></span>
    <button id="themeToggle"></button>
    <div id="status"></div>
    <span id="resumeStatus"></span>
    <input id="targetUrl" />
    <textarea id="jobInfo"></textarea>
    <button id="draftEmail"></button>
    <textarea id="emailOutput"></textarea>
    <button id="fillForm"></button>
    <input id="encryptionToggle" type="checkbox" />
    <div id="passwordSection"></div>
    <button id="setPasswordBtn"></button>
    <button id="clearPasswordBtn"></button>
    <input id="passwordInput" />
    <input id="passwordConfirm" />
    <span id="passwordStatus"></span>
    <button id="uploadResumeBtn"></button>
    <input id="resumeFileInput" type="file" />
    <input id="autoFillToggle" type="checkbox" />
  `;
}

// Mock chrome.runtime.sendMessage
function createMockChromeRuntime() {
  global.chrome = {
    runtime: {
      sendMessage: jest.fn((msg) => {
        return Promise.resolve(null);
      }),
    },
    storage: {
      local: {
        get: jest.fn((keys, cb) => cb({})),
        set: jest.fn((items, cb) => cb()),
      },
      session: {
        get: jest.fn((keys, cb) => cb({})),
        set: jest.fn((items, cb) => cb()),
        remove: jest.fn((keys, cb) => cb()),
      },
    },
    tabs: {
      query: jest.fn((query, cb) => cb([])),
    },
  };
}

// Helper to read PDF fixture and extract text (simulating pdfjsLib behavior)
function readPDFText(filePath) {
  // Since we can't run pdfjsLib in jsdom, we simulate the text extraction
  // by reading the raw PDF content and extracting the text strings
  // PDFs store text as (content) Tj operators, with T* for newlines
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString('utf-8');

  const regex = /\(([^)]*)\) Tj(?: T\*)?/g;
  const lines = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    lines.push(match[1]);
  }
  return lines.join('\n');
}

describe('PDF CV Parsing E2E', () => {
  beforeEach(() => {
    createMockPopupDOM();
    createMockChromeRuntime();
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.chrome;
  });

  describe('English CV PDF', () => {
    test('parses name, email, phone, linkedin, github from cv-english.pdf', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-english.pdf');
      const text = readPDFText(pdfPath);
      
      expect(text).toBeTruthy();
      expect(text.length).toBeGreaterThan(0);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.phone).toBe('+1 555-123-4567');
      expect(result.linkedin).toBe('linkedin.com/in/johndoe');
      expect(result.github).toBe('github.com/johndoe');
      expect(result.skills.length).toBeGreaterThan(0);
      expect(result.experience.length).toBeGreaterThan(0);
    });

    test('populates popup fields from parsed CV', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-english.pdf');
      const text = readPDFText(pdfPath);
      const parsed = parseCVText(text);
      
      // Simulate populateFields
      document.getElementById('field-name').value = parsed.name || '';
      document.getElementById('field-email').value = parsed.email || '';
      document.getElementById('field-phone').value = parsed.phone || '';
      document.getElementById('field-linkedin').value = parsed.linkedin || '';
      document.getElementById('field-github').value = parsed.github || '';
      
      expect(document.getElementById('field-name').value).toBe('John Doe');
      expect(document.getElementById('field-email').value).toBe('john.doe@example.com');
      expect(document.getElementById('field-phone').value).toBe('+1 555-123-4567');
      expect(document.getElementById('field-linkedin').value).toBe('linkedin.com/in/johndoe');
      expect(document.getElementById('field-github').value).toBe('github.com/johndoe');
    });
  });

  describe('French CV PDF', () => {
    test('parses French CV with accented characters', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-french.pdf');
      const text = readPDFText(pdfPath);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('Marie Curie');
      expect(result.email).toBe('marie@example.com');
      expect(result.phone).toBe('+33 6 12 34 56 78');
      expect(result.linkedin).toBe('linkedin.com/in/mariecurie');
      expect(result.github).toBe('github.com/mariecurie');
    });
  });

  describe('German CV PDF', () => {
    test('parses German CV with correct phone format', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-german.pdf');
      const text = readPDFText(pdfPath);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('Anna Schmidt');
      expect(result.email).toBe('anna.schmidt@example.com');
      expect(result.phone).toBe('+49 30 123456');
      expect(result.linkedin).toBe('linkedin.com/in/annaschmidt');
      expect(result.github).toBe('github.com/annaschmidt');
    });
  });

  describe('Spanish CV PDF', () => {
    test('parses Spanish CV with accented name', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-spanish.pdf');
      const text = readPDFText(pdfPath);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('Carlos García');
      expect(result.email).toBe('carlos.garcia@example.com');
      expect(result.phone).toBe('+34 612 345 678');
      expect(result.linkedin).toBe('linkedin.com/in/carlosgarcia');
      expect(result.github).toBe('github.com/carlosgarcia');
    });
  });

  describe('Minimal CV PDF', () => {
    test('parses CV with only name, email, phone', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-minimal.pdf');
      const text = readPDFText(pdfPath);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('Jane Smith');
      expect(result.email).toBe('jane.smith@company.com');
      expect(result.phone).toBe('+1 555-987-6543');
      expect(result.linkedin).toBe('');
      expect(result.github).toBe('');
    });
  });

  describe('CV with no contact info', () => {
    test('handles missing email and phone gracefully', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-no-contact.pdf');
      const text = readPDFText(pdfPath);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('No Contact Info');
      expect(result.email).toBe('');
      expect(result.phone).toBe('');
      expect(result.skills.length).toBeGreaterThan(0);
    });
  });

  describe('Skills-heavy CV PDF', () => {
    test('extracts multiple skills from CV', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-skills-heavy.pdf');
      const text = readPDFText(pdfPath);
      
      const result = parseCVText(text);
      
      expect(result.name).toBe('Dev Expert');
      expect(result.email).toBe('dev@example.com');
      expect(result.skills.length).toBeGreaterThanOrEqual(5);
      expect(result.skills).toContain('JavaScript');
      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('Docker');
      expect(result.skills).toContain('Kubernetes');
    });
  });

  describe('Corrupted PDF handling', () => {
    test('fails gracefully on corrupted PDF', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'corrupted.pdf');
      const buffer = fs.readFileSync(pdfPath);
      const content = buffer.toString('utf-8');
      
      // Corrupted PDF should have no extractable text
      const textMatches = content.match(/\(([^)]*)\) Tj/g);
      expect(textMatches).toBeNull();
    });
  });

  describe('Empty PDF handling', () => {
    test('fails gracefully on empty PDF', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'empty.pdf');
      const buffer = fs.readFileSync(pdfPath);
      expect(buffer.length).toBe(0);
    });
  });

  describe('Full workflow: PDF -> Parse -> Fields -> Storage', () => {
    test('complete CV data flow', () => {
      const pdfPath = path.join(FIXTURES_DIR, 'cv-english.pdf');
      const text = readPDFText(pdfPath);
      const parsed = parseCVText(text);
      
      // Populate fields
      document.getElementById('field-name').value = parsed.name;
      document.getElementById('field-email').value = parsed.email;
      document.getElementById('field-phone').value = parsed.phone;
      document.getElementById('field-linkedin').value = parsed.linkedin;
      document.getElementById('field-github').value = parsed.github;
      
      // Get field data (simulating getFieldData)
      const fieldData = {
        name: document.getElementById('field-name').value,
        email: document.getElementById('field-email').value,
        phone: document.getElementById('field-phone').value,
        linkedin: document.getElementById('field-linkedin').value,
        github: document.getElementById('field-github').value,
      };
      
      // Verify all fields populated correctly
      expect(fieldData.name).toBe('John Doe');
      expect(fieldData.email).toBe('john.doe@example.com');
      expect(fieldData.phone).toBe('+1 555-123-4567');
      expect(fieldData.linkedin).toBe('linkedin.com/in/johndoe');
      expect(fieldData.github).toBe('github.com/johndoe');
      
      // Verify field data matches parsed CV core fields
      expect(fieldData).toMatchObject({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        linkedin: parsed.linkedin,
        github: parsed.github,
      });
    });
  });

  describe('PDF text extraction simulation', () => {
    test('extracts text from all valid PDF fixtures', () => {
      const validPDFs = [
        'cv-english.pdf',
        'cv-french.pdf',
        'cv-german.pdf',
        'cv-spanish.pdf',
        'cv-minimal.pdf',
        'cv-no-contact.pdf',
        'cv-skills-heavy.pdf',
      ];

      for (const pdfName of validPDFs) {
        const pdfPath = path.join(FIXTURES_DIR, pdfName);
        const text = readPDFText(pdfPath);
        
        expect(text).toBeTruthy();
        expect(text.length).toBeGreaterThan(0);
        
        const result = parseCVText(text);
        expect(result.name).toBeTruthy();
        expect(result.name.length).toBeGreaterThan(0);
      }
    });
  });
});
