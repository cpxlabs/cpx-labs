const name = 'LinkedIn';

function matches(url) {
  return url.includes('linkedin.com');
}

async function fill(data) {
  const selectors = [
    'input[name="name"]',
    'input[name="email"]',
    'input[type="tel"]',
    'textarea',
    'input.fb-dash-form-element',
    '[id$="-jobs-easy-apply-form-element"] input',
    'textarea.fb-dash-form-element',
  ];

  const fields = [];
  const seen = new Set();
  for (const sel of selectors) {
    for (const el of document.querySelectorAll(sel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      fields.push(el);
    }
  }

  let filled = 0;
  const nameMatch = /name|first|last/i;
  const emailMatch = /email|e-mail/i;
  const phoneMatch = /phone|tel|mobile/i;
  const textareaMatch = /cover|letter|message|comment/i;

  for (const field of fields) {
    const tag = field.tagName.toLowerCase();
    const type = (field.getAttribute('type') || '').toLowerCase();
    const nameAttr = (field.getAttribute('name') || '').toLowerCase();
    const id = (field.getAttribute('id') || '').toLowerCase();
    const placeholder = (field.getAttribute('placeholder') || '').toLowerCase();
    const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
    const cls = (field.className || '').toLowerCase();

    const haystack = [nameAttr, id, placeholder, ariaLabel, cls].join(' ');

    let value = '';
    if (tag === 'textarea' && textareaMatch.test(haystack)) {
      value = data.coverLetter || data.name || '';
    } else if (emailMatch.test(haystack) || (type === 'email')) {
      value = data.email || '';
    } else if (phoneMatch.test(haystack) || (type === 'tel')) {
      value = data.phone || '';
    } else if (nameMatch.test(haystack)) {
      value = data.name || '';
    }

    if (value) {
      (field).value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
    }
  }

  const total = fields.length > 0 ? fields.length : 5;
  const steps = document.querySelectorAll('[data-step], [role="dialog"] .step, .jobs-easy-apply-modal').length || 1;
  return { filled, total, steps };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { name, matches, fill };
}
if (typeof window !== 'undefined') {
  window.LinkedInAutofill = { name, matches, fill };
}
