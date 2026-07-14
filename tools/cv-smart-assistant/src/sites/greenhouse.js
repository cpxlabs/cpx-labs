const name = 'Greenhouse';

function matches(url) {
  return url.includes('greenhouse.io');
}

async function fill(data) {
  const fieldMap = {
    first_name: data.firstName || (data.name ? data.name.split(' ')[0] : ''),
    last_name: data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : ''),
    email: data.email || '',
    phone: data.phone || '',
    linkedin_profile: data.linkedin || '',
    github_profile_url: data.github || '',
  };

  const fields = document.querySelectorAll('input[name], select[name], textarea[name]');
  let filled = 0;
  let total = 0;

  for (const field of fields) {
    const nameAttr = field.getAttribute('name') || '';
    const value = fieldMap[nameAttr];
    if (value && nameAttr) {
      (field).value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
      total++;
    } else if (nameAttr) {
      total++;
    }
  }

  const answerFields = document.querySelectorAll('[name*="job_application_answers"]');
  for (const field of answerFields) {
    if (!field.value) {
      (field).value = data.name || '';
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
      total++;
    }
  }

  if (total === 0) {
    return { filled: 0, total: 5 };
  }

  return { filled, total };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { name, matches, fill };
}
if (typeof window !== 'undefined') {
  window.GreenhouseAutofill = { name, matches, fill };
}
