/**
 * @jest-environment jsdom
 * 
 * E2E tests for form autofill workflow.
 * Tests: parsed CV data -> field mapping -> form filling -> event dispatch
 */
const { parseCVText } = require('../src/lib/parser');
const { findField, getFieldMappings, fillFields, findAllFields } = require('../src/lib/formFiller');

// Mock DOM with realistic job application form
function createJobApplicationForm() {
  document.body.innerHTML = `
    <form id="application-form">
      <label for="full_name">Full Name</label>
      <input id="full_name" name="full_name" placeholder="Enter your full name" />
      
      <label for="email">Email Address</label>
      <input id="email" name="email" type="email" placeholder="your@email.com" />
      
      <label for="phone">Phone Number</label>
      <input id="phone" name="phone" type="tel" placeholder="+1 555-000-0000" />
      
      <label for="linkedin">LinkedIn Profile</label>
      <input id="linkedin" name="linkedin_url" placeholder="https://linkedin.com/in/..." />
      
      <label for="github">GitHub Profile</label>
      <input id="github" name="github_handle" placeholder="https://github.com/..." />
      
      <textarea name="cover_letter" placeholder="Tell us about yourself"></textarea>
      
      <select name="experience_level">
        <option value="">Select level</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid-level</option>
        <option value="senior">Senior</option>
      </select>
    </form>
  `;
}

// Mock multi-site forms
function createLinkedInForm() {
  document.body.innerHTML = `
    <form>
      <input name="name" aria-label="Full Name" />
      <input name="email" type="email" />
      <input type="tel" aria-label="Phone number" />
      <input name="linkedin_url" placeholder="LinkedIn URL" />
      <input name="github_url" placeholder="GitHub URL" />
    </form>
  `;
}

function createGreenhouseForm() {
  document.body.innerHTML = `
    <form>
      <input name="first_name" placeholder="First Name" />
      <input name="last_name" placeholder="Last Name" />
      <input name="email" type="email" />
      <input name="phone" type="tel" />
      <input name="linkedin" placeholder="LinkedIn" />
      <input name="github" placeholder="GitHub" />
      <input name="resume_file" type="file" />
    </form>
  `;
}

function createMinimalForm() {
  document.body.innerHTML = `
    <form>
      <input name="name" />
      <input name="email" />
      <input name="phone" />
    </form>
  `;
}

function createNoMatchForm() {
  document.body.innerHTML = `
    <form>
      <input name="search_query" placeholder="Search" />
      <input name="pw" type="password" placeholder="Password" />
      <input name="color_choice" placeholder="Pick a color" />
    </form>
  `;
}

describe('Form Autofill E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('English CV -> Job Application Form', () => {
    const cvText = `John Doe
Software Engineer
john.doe@example.com
+1 555-123-4567
linkedin.com/in/johndoe
github.com/johndoe
Skills: JavaScript, Python, React, Docker`;

    test('parses CV and fills all matching fields', () => {
      createJobApplicationForm();
      
      const parsed = parseCVText(cvText);
      
      expect(parsed.name).toBe('John Doe');
      expect(parsed.email).toBe('john.doe@example.com');
      expect(parsed.phone).toBe('+1 555-123-4567');
      expect(parsed.linkedin).toBe('linkedin.com/in/johndoe');
      expect(parsed.github).toBe('github.com/johndoe');
      
      const filled = fillFields(parsed);
      
      expect(filled).toBe(6);
      expect(document.querySelector('#full_name').value).toBe('John Doe');
      expect(document.querySelector('#email').value).toBe('john.doe@example.com');
      expect(document.querySelector('#phone').value).toBe('+1 555-123-4567');
      expect(document.querySelector('#linkedin').value).toBe('linkedin.com/in/johndoe');
      expect(document.querySelector('#github').value).toBe('github.com/johndoe');
    });

    test('dispatches input and change events on filled fields', () => {
      createJobApplicationForm();
      
      const parsed = parseCVText(cvText);
      const inputSpy = jest.spyOn(HTMLInputElement.prototype, 'dispatchEvent');
      
      fillFields(parsed);
      
      // 2 events per field (input + change) * 5 fields = 10 (textarea is not HTMLInputElement)
      expect(inputSpy).toHaveBeenCalledTimes(10);
      
      const eventTypes = inputSpy.mock.calls.map(([e]) => e.type);
      expect(eventTypes.filter(t => t === 'input')).toHaveLength(5);
      expect(eventTypes.filter(t => t === 'change')).toHaveLength(5);
      
      inputSpy.mockRestore();
    });
  });

  describe('French CV -> Job Application Form', () => {
    const cvText = `Marie Curie
Développeur
marie@example.com
+33 6 12 34 56 78
linkedin.com/in/mariecurie
github.com/mariecurie`;

    test('parses and fills French CV data', () => {
      createJobApplicationForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(6);
      expect(document.querySelector('#full_name').value).toBe('Marie Curie');
      expect(document.querySelector('#email').value).toBe('marie@example.com');
      expect(document.querySelector('#phone').value).toBe('+33 6 12 34 56 78');
    });
  });

  describe('German CV -> Job Application Form', () => {
    const cvText = `Anna Schmidt
Software Entwicklerin
anna.schmidt@example.com
+49 30 123456
linkedin.com/in/annaschmidt
github.com/annaschmidt`;

    test('parses and fills German CV data', () => {
      createJobApplicationForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(6);
      expect(document.querySelector('#full_name').value).toBe('Anna Schmidt');
      expect(document.querySelector('#email').value).toBe('anna.schmidt@example.com');
      expect(document.querySelector('#phone').value).toBe('+49 30 123456');
    });
  });

  describe('Spanish CV -> Job Application Form', () => {
    const cvText = `Carlos García
Ingeniero de Software
carlos.garcia@example.com
+34 612 345 678
linkedin.com/in/carlosgarcia
github.com/carlosgarcia`;

    test('parses and fills Spanish CV data', () => {
      createJobApplicationForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(6);
      expect(document.querySelector('#full_name').value).toBe('Carlos García');
      expect(document.querySelector('#email').value).toBe('carlos.garcia@example.com');
      expect(document.querySelector('#phone').value).toBe('+34 612 345 678');
    });
  });

  describe('Minimal CV -> Partial Form Fill', () => {
    const cvText = `Jane Smith
jane.smith@company.com
+1 555-987-6543`;

    test('fills only available fields (name, email, phone)', () => {
      createJobApplicationForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(4);
      expect(document.querySelector('#full_name').value).toBe('Jane Smith');
      expect(document.querySelector('#email').value).toBe('jane.smith@company.com');
      expect(document.querySelector('#phone').value).toBe('+1 555-987-6543');
      expect(document.querySelector('#linkedin').value).toBe('');
      expect(document.querySelector('#github').value).toBe('');
    });
  });

  describe('LinkedIn-style form', () => {
    const cvText = `John Doe
john.doe@example.com
+1 555-123-4567
linkedin.com/in/johndoe
github.com/johndoe`;

    test('fills LinkedIn form fields correctly', () => {
      createLinkedInForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(5);
      expect(document.querySelector('input[name="name"]').value).toBe('John Doe');
      expect(document.querySelector('input[name="email"]').value).toBe('john.doe@example.com');
      expect(document.querySelector('input[type="tel"]').value).toBe('+1 555-123-4567');
    });
  });

  describe('Greenhouse-style form', () => {
    const cvText = `John Doe
john.doe@example.com
+1 555-123-4567
linkedin.com/in/johndoe
github.com/johndoe`;

    test('fills Greenhouse form fields correctly', () => {
      createGreenhouseForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      // first_name and last_name both match "name" keyword
      expect(filled).toBeGreaterThanOrEqual(3);
      expect(document.querySelector('input[name="email"]').value).toBe('john.doe@example.com');
      expect(document.querySelector('input[name="phone"]').value).toBe('+1 555-123-4567');
    });
  });

  describe('Minimal form (only name, email, phone)', () => {
    const cvText = `John Doe
john.doe@example.com
+1 555-123-4567
linkedin.com/in/johndoe
github.com/johndoe`;

    test('fills only available form fields', () => {
      createMinimalForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(3);
      expect(document.querySelector('input[name="name"]').value).toBe('John Doe');
      expect(document.querySelector('input[name="email"]').value).toBe('john.doe@example.com');
      expect(document.querySelector('input[name="phone"]').value).toBe('+1 555-123-4567');
    });
  });

  describe('No matching form fields', () => {
    const cvText = `John Doe
john.doe@example.com
+1 555-123-4567`;

    test('returns 0 filled when no fields match', () => {
      createNoMatchForm();
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(0);
    });
  });

  describe('Empty CV data', () => {
    test('does not fill any fields with empty data', () => {
      createJobApplicationForm();
      
      const emptyData = { name: '', email: '', phone: '', linkedin: '', github: '' };
      const filled = fillFields(emptyData);
      
      expect(filled).toBe(0);
    });
  });

  describe('Partial CV data (only name)', () => {
    test('fills only name field', () => {
      createJobApplicationForm();
      
      const partialData = { name: 'Test User', email: '', phone: '', linkedin: '', github: '' };
      const filled = fillFields(partialData);
      
      expect(filled).toBe(1);
      expect(document.querySelector('#full_name').value).toBe('Test User');
    });
  });

  describe('findAllFields scoring', () => {
    test('returns scored field candidates', () => {
      createJobApplicationForm();
      
      const data = {
        name: 'John',
        email: 'john@test.com',
        phone: '555-1234',
        linkedin: 'john-doe',
        github: 'johndoe',
      };
      
      const results = findAllFields(data);
      
      expect(results.length).toBeGreaterThanOrEqual(5);
      
      const nameResults = results.filter(r => r.key === 'name');
      expect(nameResults.length).toBeGreaterThan(0);
      expect(nameResults[0].score).toBeGreaterThan(0);
      expect(nameResults[0].value).toBe('John');
    });
  });

  describe('getFieldMappings', () => {
    test('returns correct field mappings', () => {
      createJobApplicationForm();
      
      const data = {
        name: 'Jane',
        email: 'jane@test.com',
        phone: '555-0000',
        linkedin: 'jane-dev',
        github: 'janeg',
      };
      
      const mappings = getFieldMappings(data);
      
      expect(mappings).toHaveLength(8);
      expect(mappings[0].field).not.toBeNull();
      expect(mappings[0].value).toBe('Jane');
      expect(mappings[1].value).toBe('jane@test.com');
      expect(mappings[2].value).toBe('555-0000');
    });
  });

  describe('Multiple form fills (state reset)', () => {
    test('can fill different CVs on same form', () => {
      createJobApplicationForm();
      
      // First CV
      const cv1 = `John Doe
john@example.com
+1 555-0000
linkedin.com/in/john
github.com/john`;
      
      fillFields(parseCVText(cv1));
      expect(document.querySelector('#full_name').value).toBe('John Doe');
      expect(document.querySelector('#email').value).toBe('john@example.com');
      
      // Second CV (overwrite)
      const cv2 = `Jane Smith
jane@example.com
+1 555-1111
linkedin.com/in/jane
github.com/jane`;
      
      fillFields(parseCVText(cv2));
      expect(document.querySelector('#full_name').value).toBe('Jane Smith');
      expect(document.querySelector('#email').value).toBe('jane@example.com');
      expect(document.querySelector('#phone').value).toBe('+1 555-1111');
    });
  });

  describe('CV with skills -> form fill', () => {
    test('skills-heavy CV still fills core fields correctly', () => {
      createJobApplicationForm();
      
      const cvText = `Dev Expert
dev@example.com
+1 555-0000
Technical Skills: JavaScript, TypeScript, Python, Java, C++, Rust
React, Vue, Angular, Svelte, Node.js
Docker, Kubernetes, AWS, GCP, Terraform
PostgreSQL, MongoDB, Redis, Elasticsearch`;
      
      const parsed = parseCVText(cvText);
      const filled = fillFields(parsed);
      
      expect(filled).toBe(4); // name, email, phone, experience
      expect(document.querySelector('#full_name').value).toBe('Dev Expert');
      expect(document.querySelector('#email').value).toBe('dev@example.com');
      expect(document.querySelector('#phone').value).toBe('+1 555-0000');
      expect(parsed.skills.length).toBeGreaterThanOrEqual(5);
    });
  });
});
