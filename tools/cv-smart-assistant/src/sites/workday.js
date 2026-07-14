const name = 'Workday';

function matches(url) {
  return url.includes('myworkdayjobs.com') || url.includes('wd5.myworkdayjobs.com');
}

async function fill(data) {
  const fieldMap = [
    { patterns: ['contactInfo-name', 'name', 'fullName', 'firstName'], value: data.name || '' },
    { patterns: ['email', 'e-mail'], value: data.email || '' },
    { patterns: ['phone', 'telephone', 'mobile', 'contactInfo-phone'], value: data.phone || '' },
    { patterns: ['linkedin', 'linkedIn', 'url-LinkedIn'], value: data.linkedin || '' },
    { patterns: ['github', 'gitHub', 'url-GitHub'], value: data.github || '' },
  ];

  const allFields = document.querySelectorAll('input, select, textarea');
  let filled = 0;
  let total = 0;

  for (const entry of fieldMap) {
    let found = false;
    for (const field of allFields) {
      if (found) break;
      const automationId = (field.getAttribute('data-automation-id') || '').toLowerCase();
      const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
      const nameAttr = (field.getAttribute('name') || '').toLowerCase();
      const placeholder = (field.getAttribute('placeholder') || '').toLowerCase();
      const haystack = [automationId, ariaLabel, nameAttr, placeholder].join(' ');

      for (const pattern of entry.patterns) {
        if (haystack.includes(pattern.toLowerCase()) && entry.value) {
          (field).value = entry.value;
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
          filled++;
          found = true;
          break;
        }
      }
    }
  }

  return { filled, total: fieldMap.length };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { name, matches, fill };
}
if (typeof window !== 'undefined') {
  window.WorkdayAutofill = { name, matches, fill };
}
