const fs = require('fs');
const path = require('path');

const contentSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'content', 'content.js'), 'utf-8');

function loadContentScript() {
  global.chrome = {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
      sendMessage: jest.fn(),
    },
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn(),
      },
    },
  };

  const origFilesDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
  Object.defineProperty(HTMLInputElement.prototype, 'files', {
    configurable: true,
    get() {
      return this._mockFiles !== undefined
        ? this._mockFiles
        : (origFilesDescriptor ? origFilesDescriptor.get.call(this) : []);
    },
    set(v) { this._mockFiles = v; },
  });

  global.DataTransfer = class DataTransfer {
    constructor() { this._files = []; }
    get items() { return { add: (f) => this._files.push(f) }; }
    get files() { return this._files; }
  };

  global.eval(contentSrc);
}

beforeEach(() => {
  document.body.innerHTML = '';
  if (!HTMLElement.prototype._origOffsetParent) {
    HTMLElement.prototype._origOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
  }
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get() {
      if (this.style.display === 'none' || !this.isConnected) return null;
      return this.parentElement || document.body;
    },
  });
  loadContentScript();
});

afterEach(() => {
  delete global.chrome;
  if (HTMLElement.prototype._origOffsetParent) {
    Object.defineProperty(HTMLElement.prototype, 'offsetParent',
      HTMLElement.prototype._origOffsetParent);
    delete HTMLElement.prototype._origOffsetParent;
  }
});

afterEach(() => {
  delete global.scoreField;
  delete global.findAllElements;
  delete global.highlightField;
  delete global.uploadResume;
  delete global.tryUploadResume;
  delete global.showFieldMapper;
  delete global.siteHandlers;
  delete global.startAutoFillObserver;
  delete global.stopAutoFillObserver;
  delete global.DataTransfer;
});

describe('scoreField', () => {
  test('scores exact name match highest', () => {
    const el = document.createElement('input');
    el.name = 'email';
    const score = scoreField(el, ['email']);
    expect(score).toBeGreaterThan(0);
  });

  test('prefers visible elements', () => {
    const visible = document.createElement('input');
    visible.name = 'email';
    visible.style.display = 'block';
    document.body.appendChild(visible);

    const hidden = document.createElement('input');
    hidden.name = 'email';
    hidden.style.display = 'none';
    document.body.appendChild(hidden);

    const vScore = scoreField(visible, ['email']);
    const hScore = scoreField(hidden, ['email']);
    expect(vScore).toBeGreaterThan(hScore);
  });

  test('scores by name, id, placeholder, aria-label', () => {
    const el = document.createElement('input');
    el.name = 'phone';
    el.placeholder = 'Phone number';
    el.setAttribute('aria-label', 'Phone input');
    document.body.appendChild(el);

    const score = scoreField(el, ['phone']);
    expect(score).toBeGreaterThan(0);

    const noMatch = scoreField(el, ['nonexistent']);
    expect(noMatch).toBe(1);
  });

  test('checks extra attributes', () => {
    const el = document.createElement('input');
    el.setAttribute('data-field', 'email_address');
    document.body.appendChild(el);

    const score = scoreField(el, ['email'], ['data-field']);
    expect(score).toBeGreaterThan(1);
  });

  test('returns visibility bonus even with no keyword match', () => {
    const el = document.createElement('input');
    el.name = 'xyz';
    document.body.appendChild(el);
    const score = scoreField(el, ['no-match']);
    expect(score).toBe(1);
  });
});

describe('findAllElements', () => {
  test('finds elements by selector', () => {
    document.body.innerHTML = '<input class="test"><input class="test"><div class="test"></div>';
    const results = findAllElements('.test');
    expect(results).toHaveLength(3);
  });

  test('finds elements inside shadow DOM', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<input class="shadow-input">';
    document.body.appendChild(host);

    const results = findAllElements('.shadow-input');
    expect(results).toHaveLength(1);
  });
});

describe('highlightField', () => {
  test('adds and removes highlight styling', () => {
    const el = document.createElement('input');
    document.body.appendChild(el);

    jest.useFakeTimers();
    highlightField(el);

    expect(el.style.backgroundColor).toBe('rgb(212, 237, 218)');

    jest.advanceTimersByTime(1600);
    expect(el.style.backgroundColor).toBe('');
    jest.useRealTimers();
  });
});

describe('uploadResume', () => {
  test('uploads resume to file input', () => {
    const input = document.createElement('input');
    input.type = 'file';
    document.body.appendChild(input);

    const b64 = btoa('fake pdf content');
    uploadResume(input, b64, 'test.pdf');

    expect(input.files.length).toBe(1);
    expect(input.files[0].name).toBe('test.pdf');
  });
});

describe('tryUploadResume', () => {
  test('returns false when no resumeBlob', () => {
    const result = tryUploadResume({});
    expect(result).toBe(false);
  });

  test('uploads to visible file input', () => {
    document.body.innerHTML = '<input type="file" style="display:block">';
    const b64 = btoa('resume content');
    const result = tryUploadResume({ resumeBlob: b64, resumeName: 'resume.pdf' });
    expect(result).toBe(true);
  });
});

describe('showFieldMapper', () => {
  test('creates and shows field mapper menu', () => {
    showFieldMapper(100, 200);
    const menu = document.getElementById('cv-field-mapper');
    expect(menu).not.toBeNull();
    expect(menu.style.top).toBe('200px');
    expect(menu.style.left).toBe('100px');

    const items = menu.querySelectorAll('[data-field]');
    expect(items.length).toBeGreaterThan(0);
  });

  test('replaces existing menu', () => {
    showFieldMapper(100, 100);
    showFieldMapper(200, 200);
    const menus = document.querySelectorAll('#cv-field-mapper');
    expect(menus.length).toBe(1);
  });
});

describe('siteHandlers', () => {
  test('LinkedIn matches linkedin.com URLs', () => {
    const handler = siteHandlers.find(h => h.name === 'LinkedIn');
    expect(handler.matches('https://linkedin.com/jobs')).toBe(true);
    expect(handler.matches('https://google.com')).toBe(false);
  });

  test('Greenhouse matches greenhouse.io URLs', () => {
    const handler = siteHandlers.find(h => h.name === 'Greenhouse');
    expect(handler.matches('https://boards.greenhouse.io/acme')).toBe(true);
    expect(handler.matches('https://google.com')).toBe(false);
  });

  test('Lever matches lever.co URLs', () => {
    const handler = siteHandlers.find(h => h.name === 'Lever');
    expect(handler.matches('https://jobs.lever.co/acme')).toBe(true);
    expect(handler.matches('https://google.com')).toBe(false);
  });

  test('Workday matches myworkdayjobs.com URLs', () => {
    const handler = siteHandlers.find(h => h.name === 'Workday');
    expect(handler.matches('https://acme.myworkdayjobs.com/careers')).toBe(true);
    expect(handler.matches('https://wd5.myworkdayjobs.com/acme')).toBe(true);
    expect(handler.matches('https://google.com')).toBe(false);
  });

  test('Generic matches everything', () => {
    const handler = siteHandlers.find(h => h.name === 'Generic');
    expect(handler.matches('any-url')).toBe(true);
    expect(handler.matches('')).toBe(true);
  });

  test('handlers are ordered with Generic last', () => {
    const last = siteHandlers[siteHandlers.length - 1];
    expect(last.name).toBe('Generic');
  });

  describe('fill functions', () => {
    test('LinkedIn fills matching fields', () => {
      document.body.innerHTML = '<input name="name"><input name="email">';
      const handler = siteHandlers.find(h => h.name === 'LinkedIn');
      const result = handler.fill({ name: 'John', email: 'john@test.com' });
      expect(result.filled).toBeGreaterThan(0);
      expect(document.querySelector('input[name="name"]').value).toBe('John');
    });

    test('Generic fill handles select elements', () => {
      document.body.innerHTML = `
        <select name="phone">
          <option value="">Select</option>
          <option value="work">Work Phone</option>
          <option value="mobile">Mobile Phone</option>
        </select>
      `;
      const handler = siteHandlers.find(h => h.name === 'Generic');
      handler.fill({ phone: 'Mobile Phone' });
      expect(document.querySelector('select').value).toBe('mobile');
    });

    test('Greenhouse fill uses data-field attribute', () => {
      document.body.innerHTML = '<input name="first_name"><input data-field="email">';
      const handler = siteHandlers.find(h => h.name === 'Greenhouse');
      handler.fill({ name: 'Jane', email: 'jane@test.com' });
      expect(document.querySelector('input[name="first_name"]').value).toBe('Jane');
    });

    test('Workday fill uses data-automation-id attribute', () => {
      document.body.innerHTML = '<input data-automation-id="email"><input name="phone">';
      const handler = siteHandlers.find(h => h.name === 'Workday');
      handler.fill({ email: 'a@b.com', phone: '555-0000' });
      expect(document.querySelector('input[data-automation-id="email"]').value).toBe('a@b.com');
    });
  });
});

describe('startAutoFillObserver / stopAutoFillObserver', () => {
  test('starts and stops observer without error', () => {
    document.body.innerHTML = '<div></div>';
    expect(() => {
      startAutoFillObserver({ name: 'test' });
      stopAutoFillObserver();
    }).not.toThrow();
  });
});
