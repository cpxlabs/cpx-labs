const name = 'Lever';

function matches(url) {
  return url.includes('lever.co');
}

async function fill(data) {
  const fieldMap = {
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    'urls[LinkedIn]': data.linkedin || '',
    'urls[GitHub]': data.github || '',
    comments: data.coverLetter || '',
  };

  const selectors = Object.keys(fieldMap).map((n) => `input[name="${n}"], textarea[name="${n}"]`).join(', ');
  const fields = document.querySelectorAll(selectors);

  let filled = 0;
  let total = 0;

  for (const field of fields) {
    const nameAttr = field.getAttribute('name') || '';
    const value = fieldMap[nameAttr];
    if (value !== undefined) {
      (field).value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
      total++;
    } else if (nameAttr) {
      total++;
    }
  }

  return total > 0 ? { filled, total } : { filled: 0, total: 5 };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { name, matches, fill };
}
if (typeof window !== 'undefined') {
  window.LeverAutofill = { name, matches, fill };
}
