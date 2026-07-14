const { findField, getFieldMappings, fillFields, findAllFields, getFillScript } = require('../src/lib/formFiller');

beforeEach(() => {
  document.body.innerHTML = `
    <input name="full_name" id="name" placeholder="Nome completo" />
    <input name="email" placeholder="Email" />
    <input name="phone" id="tel" placeholder="Celular" />
    <input name="linkedin_url" placeholder="LinkedIn Profile" />
    <input name="github_handle" placeholder="GitHub Username" />
    <input name="skills" placeholder="Skills/Habilidades" />
    <textarea name="education" placeholder="Formação Acadêmica"></textarea>
    <textarea name="experience" placeholder="Experiência Profissional"></textarea>
    <input name="other_field" placeholder="Extra" />
  `;
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('findField', () => {
  test('finds input by name attribute', () => {
    const el = findField(['email']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('email');
  });

  test('finds input by id attribute', () => {
    const el = findField(['tel']);
    expect(el).not.toBeNull();
    expect(el.id).toBe('tel');
  });

  test('finds input by placeholder attribute', () => {
    const el = findField(['Nome completo']);
    expect(el).not.toBeNull();
    expect(el.placeholder).toBe('Nome completo');
  });

  test('matches case-insensitively', () => {
    const el = findField(['EMAIL']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('email');
  });

  test('matches substring in name', () => {
    const el = findField(['linkedin']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('linkedin_url');
  });

  test('matches substring in id', () => {
    const el = findField(['git']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('github_handle');
  });

  test('matches substring in placeholder', () => {
    const el = findField(['User']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('github_handle');
  });

  test('uses first keyword match', () => {
    const el = findField(['nomatch', 'full_name', 'nome']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('full_name');
  });

  test('returns null when no field matches', () => {
    const el = findField(['nonexistent', 'xyz']);
    expect(el).toBeNull();
  });

  test('matches textarea with matching name', () => {
    document.body.innerHTML = '<textarea name="comment"></textarea>';
    const el = findField(['comment']);
    expect(el).not.toBeNull();
    expect(el.tagName).toBe('TEXTAREA');
  });

  test('matches select with matching id', () => {
    document.body.innerHTML = '<select id="country"></select>';
    const el = findField(['country']);
    expect(el).not.toBeNull();
    expect(el.tagName).toBe('SELECT');
  });

  test('uses label text association via htmlFor', () => {
    document.body.innerHTML = '<label for="fullname">Full Name</label><input id="fullname">';
    const el = findField(['Full Name']);
    expect(el).not.toBeNull();
    expect(el.id).toBe('fullname');
  });

  test('uses label nesting', () => {
    document.body.innerHTML = '<label>Email <input name="email_addr"></label>';
    const el = findField(['Email']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('email_addr');
  });

  test('picks higher-scored match over lower-scored', () => {
    document.body.innerHTML = '<input name="name"><input name="full_name">';
    const el = findField(['name']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('name');
  });

  test('finds input by aria-label', () => {
    document.body.innerHTML = '<input name="firstname" aria-label="First Name">';
    const el = findField(['First Name']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('firstname');
  });

  test('finds input with multi-language keyword', () => {
    document.body.innerHTML = '<input name="nombre">';
    const el = findField(['nombre']);
    expect(el).not.toBeNull();
    expect(el.name).toBe('nombre');
  });
});

describe('findAllFields', () => {
  test('returns multiple matches from default DOM', () => {
    const data = {
      name: 'John',
      email: 'john@test.com',
      phone: '555-1234',
      linkedin: 'john-doe',
      github: 'johndoe',
    };
    const results = findAllFields(data);
    expect(results.length).toBeGreaterThanOrEqual(5);
    const keys = results.map(r => r.key);
    expect(keys).toContain('name');
    expect(keys).toContain('email');
    expect(keys).toContain('phone');
    expect(keys).toContain('linkedin');
    expect(keys).toContain('github');
    const nameResult = results.find(r => r.key === 'name');
    expect(nameResult.value).toBe('John');
    expect(nameResult.score).toBeGreaterThan(0);
  });

  test('includes textarea and select elements', () => {
    document.body.innerHTML = `
      <input name="email" placeholder="Email">
      <textarea name="full_name" placeholder="Name"></textarea>
      <select name="phone" id="tel"></select>
    `;
    const data = {
      name: 'John',
      email: 'a@b.com',
      phone: '555-1234',
      linkedin: '',
      github: '',
    };
    const results = findAllFields(data);
    const textareas = results.filter(r => r.field.tagName === 'TEXTAREA');
    const selects = results.filter(r => r.field.tagName === 'SELECT');
    expect(textareas.length).toBeGreaterThan(0);
    expect(selects.length).toBeGreaterThan(0);
  });
});

describe('getFieldMappings', () => {
  test('returns correct mappings for all fields', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      linkedin: 'john-doe',
      github: 'johndoe',
      skills: 'JavaScript, React',
      education: 'BSc Computer Science',
      experience: 'Developer at Acme',
    };
    const mappings = getFieldMappings(data);

    expect(mappings).toHaveLength(8);
    expect(mappings[0].field.name).toBe('full_name');
    expect(mappings[0].value).toBe('John Doe');
    expect(mappings[1].field.name).toBe('email');
    expect(mappings[1].value).toBe('john@example.com');
    expect(mappings[2].field.name).toBe('phone');
    expect(mappings[2].value).toBe('555-1234');
    expect(mappings[3].field.name).toBe('linkedin_url');
    expect(mappings[3].value).toBe('john-doe');
    expect(mappings[4].field.name).toBe('github_handle');
    expect(mappings[4].value).toBe('johndoe');
    expect(mappings[5].field.name).toBe('skills');
    expect(mappings[5].value).toBe('JavaScript, React');
    expect(mappings[6].field.name).toBe('education');
    expect(mappings[6].value).toBe('BSc Computer Science');
    expect(mappings[7].field.name).toBe('experience');
    expect(mappings[7].value).toBe('Developer at Acme');
  });

  test('returns null field for missing data keys', () => {
    const data = { name: 'Jane' };
    const mappings = getFieldMappings(data);

    expect(mappings[0].field).not.toBeNull();
    expect(mappings[0].value).toBe('Jane');
    for (let i = 1; i < mappings.length; i++) {
      expect(mappings[i].value).toBeUndefined();
    }
  });
});

describe('fillFields', () => {
  test('sets values on matching fields and dispatches events', () => {
    const data = {
      name: 'Alice',
      email: 'alice@test.com',
      phone: '999-8888',
      linkedin: 'alice-dev',
      github: 'aliceg',
    };

    const eventSpy = jest.spyOn(Event.prototype, 'constructor');

    const filled = fillFields(data);

    expect(filled).toBe(5);
    expect(document.querySelector('input[name="full_name"]').value).toBe('Alice');
    expect(document.querySelector('input[name="email"]').value).toBe('alice@test.com');
    expect(document.querySelector('input[name="phone"]').value).toBe('999-8888');
    expect(document.querySelector('input[name="linkedin_url"]').value).toBe('alice-dev');
    expect(document.querySelector('input[name="github_handle"]').value).toBe('aliceg');

    eventSpy.mockRestore();
  });

  test('dispatches input and change events on each filled field', () => {
    const data = { name: 'Bob', email: 'bob@test.com', phone: '111-2222', linkedin: 'bob', github: 'bobbob' };

    const inputSpy = jest.spyOn(HTMLInputElement.prototype, 'dispatchEvent');
    fillFields(data);

    expect(inputSpy).toHaveBeenCalledTimes(10);
    const eventTypes = inputSpy.mock.calls.map(([e]) => e.type);
    expect(eventTypes.filter(t => t === 'input')).toHaveLength(5);
    expect(eventTypes.filter(t => t === 'change')).toHaveLength(5);

    inputSpy.mockRestore();
  });

  test('does not fill empty values', () => {
    const data = { name: '', email: 'x@y.com', phone: undefined, linkedin: null, github: 'gitusr' };
    const filled = fillFields(data);

    expect(filled).toBe(2);
    expect(document.querySelector('input[name="email"]').value).toBe('x@y.com');
    expect(document.querySelector('input[name="github_handle"]').value).toBe('gitusr');
    expect(document.querySelector('input[name="full_name"]').value).toBe('');
  });

  test('returns 0 when no fields match the DOM', () => {
    document.body.innerHTML = '<input name="unrelated" />';
    const data = { name: 'Test', email: 't@t.com', phone: '000', linkedin: 't', github: 't' };
    const filled = fillFields(data);
    expect(filled).toBe(0);
  });
});

describe('getFillScript', () => {
  test('returns a non-empty string', () => {
    const script = getFillScript();
    expect(typeof script).toBe('string');
    expect(script.length).toBeGreaterThan(0);
  });

  test('contains key functions and logic', () => {
    const script = getFillScript();
    expect(script).toContain('findField');
    expect(script).toContain('document.querySelector');
    expect(script).toContain('dispatchEvent');
    expect(script).toContain('new Event');
  });

  test('contains field keyword arrays', () => {
    const script = getFillScript();
    expect(script).toContain("'name'");
    expect(script).toContain("'email'");
    expect(script).toContain("'phone'");
    expect(script).toContain("'linkedin'");
    expect(script).toContain("'github'");
  });
});
