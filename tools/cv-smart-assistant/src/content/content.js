function scoreField(el, keywords, extraAttrs = []) {
  const name = (el.name || '').toLowerCase();
  const id = (el.id || '').toLowerCase();
  const placeholder = (el.placeholder || '').toLowerCase();
  const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
  const type = (el.type || '').toLowerCase();

  const labelFor = document.querySelector(`label[for="${el.id}"]`);
  const labelText = labelFor ? labelFor.textContent.toLowerCase().trim() : '';
  const parentLabel = el.closest('label');
  const parentText = parentLabel ? parentLabel.textContent.toLowerCase().trim() : '';
  const label = labelText || parentText;

  let best = 0;
  for (const kw of keywords) {
    const kwl = kw.toLowerCase();
    if (name === kwl || id === kwl) best = Math.max(best, 5);
    else if (name.includes(kwl) || id.includes(kwl)) best = Math.max(best, 4);
    if (label.includes(kwl)) best = Math.max(best, 4);
    if (ariaLabel.includes(kwl)) best = Math.max(best, 3);
    if (placeholder.includes(kwl)) best = Math.max(best, 2);
    if (type.includes(kwl)) best = Math.max(best, 1);
    for (const attr of extraAttrs) {
      const val = (el.getAttribute(attr) || '').toLowerCase();
      if (val === kwl) best = Math.max(best, 5);
      else if (val.includes(kwl)) best = Math.max(best, 3);
    }
  }
  if (el.offsetParent !== null) best += 1;
  return best;
}

function findAllElements(selector, root = document) {
  let results = Array.from(root.querySelectorAll(selector));
  for (const el of root.querySelectorAll('*')) {
    if (el.shadowRoot) {
      results = results.concat(findAllElements(selector, el.shadowRoot));
    }
  }
  return results;
}

function highlightField(el) {
  if (!el) return;
  const originalBg = el.style.backgroundColor;
  const originalTransition = el.style.transition;
  el.style.transition = 'background-color 0.4s ease';
  el.style.backgroundColor = '#d4edda';
  setTimeout(() => {
    el.style.backgroundColor = originalBg || '';
    setTimeout(() => {
      el.style.transition = originalTransition || '';
    }, 400);
  }, 1200);
}

let lastFillData = null;
let fillObserver = null;
let fillDebounceTimer = null;

function startAutoFillObserver(data) {
  lastFillData = data;
  if (fillObserver) fillObserver.disconnect();
  fillObserver = new MutationObserver(() => {
    if (fillDebounceTimer) clearTimeout(fillDebounceTimer);
    fillDebounceTimer = setTimeout(() => {
      if (lastFillData) {
        const url = window.location.href;
        const handler = siteHandlers.find((h) => h.matches(url));
        if (handler) handler.fill(lastFillData);
      }
    }, 500);
  });
  fillObserver.observe(document.body, { childList: true, subtree: true });
}

function stopAutoFillObserver() {
  if (fillObserver) { fillObserver.disconnect(); fillObserver = null; }
  if (fillDebounceTimer) { clearTimeout(fillDebounceTimer); fillDebounceTimer = null; }
  lastFillData = null;
}

function uploadResume(fileInput, base64Data, filename = 'Resume.pdf') {
  try {
    const byteChars = atob(base64Data);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
    const file = new File([bytes], filename, { type: 'application/pdf' });
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  } catch (e) { console.error('Resume upload failed:', e); }
}

function tryUploadResume(data) {
  if (!data.resumeBlob) return false;
  const fileInputs = document.querySelectorAll('input[type="file"]');
  for (const fi of fileInputs) {
    if (!fi.value && fi.offsetParent !== null) {
      uploadResume(fi, data.resumeBlob, data.resumeName || 'Resume.pdf');
      return true;
    }
  }
  return false;
}

function showFieldMapper(x, y) {
  const existing = document.getElementById('cv-field-mapper');
  if (existing) existing.remove();
  const menu = document.createElement('div');
  menu.id = 'cv-field-mapper';
  menu.style.cssText = 'position:fixed;top:' + y + 'px;left:' + x + 'px;background:#fff;border:1px solid #ccc;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:2147483647;padding:4px 0;font-family:-apple-system,sans-serif;font-size:13px;min-width:140px;';
  const title = document.createElement('div');
  title.textContent = 'Map to CV field:';
  title.style.cssText = 'padding:4px 12px;font-size:11px;color:#888;font-weight:600;';
  menu.appendChild(title);
  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'resume', label: 'Resume File' },
  ];
  fields.forEach(function(f) {
    const item = document.createElement('div');
    item.textContent = f.label;
    item.dataset.field = f.key;
    item.style.cssText = 'padding:6px 12px;cursor:pointer;';
    item.onmouseenter = function() { item.style.background = '#f0f0f0'; };
    item.onmouseleave = function() { item.style.background = ''; };
    item.onclick = function() {
      menu.remove();
      chrome.runtime.sendMessage({ type: 'STORE_MAPPING', field: f.key });
    };
    menu.appendChild(item);
  });
  document.body.appendChild(menu);
}

function setFieldValue(el, value) {
  if (!el || !value) return false;
  if (el.tagName === 'SELECT') {
    const options = Array.from(el.options);
    const match = options.find(
      (o) => o.text.toLowerCase().trim() === value.toLowerCase().trim()
    ) || options.find(
      (o) => o.text.toLowerCase().trim().includes(value.toLowerCase().trim())
    );
    el.value = match ? match.value : value;
  } else {
    el.value = value;
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  highlightField(el);
  return true;
}

function createFillHandler({ selector, keywords, extraAttrs, useShadowDom }) {
  return (data) => {
    const total = Object.values(data).filter(Boolean).length;
    const els = useShadowDom
      ? findAllElements(selector)
      : document.querySelectorAll(selector);
    const used = new Set();
    let filled = 0;

    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;
      const kw = keywords[key] || [key.replace(/_/g, ' ')];
      let best = null;
      let bestScore = 0;
      for (const el of els) {
        if (used.has(el)) continue;
        const score = scoreField(el, kw, extraAttrs);
        if (score > bestScore) {
          bestScore = score;
          best = el;
        }
      }
      if (setFieldValue(best, value)) {
        used.add(best);
        filled++;
      }
    }

    tryUploadResume(data);
    return { filled, total };
  };
}

var siteHandlers = [
  {
    name: 'LinkedIn',
    matches: (url) => /linkedin\.com/i.test(url),
    fill: createFillHandler({
      selector: 'input, textarea, select, div[contenteditable="true"]',
      keywords: {
        name: ['name', 'full-name', 'fullname', 'nome'],
        email: ['email', 'e-mail', 'correo'],
        phone: ['phone', 'tel', 'mobile', 'celular', 'telephone'],
        linkedin: ['linkedin', 'linkedin-url', 'linkedinprofile'],
        github: ['github', 'github-url'],
        skills: ['skills', 'habilidades', 'competencias', 'key-skills'],
        education: ['education', 'academic', 'formacao', 'estudos'],
        experience: ['experience', 'work-experience', 'experiencia', 'summary'],
      },
    }),
  },
  {
    name: 'Greenhouse',
    matches: (url) => /greenhouse\.io/i.test(url),
    fill: createFillHandler({
      selector: 'input:not([type="hidden"]), textarea, select',
      extraAttrs: ['data-field'],
      keywords: {
        name: ['name', 'first_name', 'last_name', 'full_name', 'nome'],
        email: ['email', 'e-mail'],
        phone: ['phone', 'telephone'],
        linkedin: ['linkedin', 'linkedin_url'],
        github: ['github', 'github_url'],
        skills: ['skills', 'habilidades', 'competencias', 'key-skills'],
        education: ['education', 'academic', 'formacao', 'estudos'],
        experience: ['experience', 'work-experience', 'experiencia', 'summary'],
      },
    }),
  },
  {
    name: 'Lever',
    matches: (url) => /lever\.co/i.test(url),
    fill: createFillHandler({
      selector: 'input:not([type="hidden"]):not([type="submit"]):not([type="file"]), textarea, select',
      keywords: {
        name: ['name', 'nome'],
        email: ['email', 'e-mail'],
        phone: ['phone', 'telephone'],
        linkedin: ['linkedin', 'linkedin_url'],
        github: ['github', 'github_url'],
        skills: ['skills', 'habilidades', 'competencias', 'key-skills'],
        education: ['education', 'academic', 'formacao', 'estudos'],
        experience: ['experience', 'work-experience', 'experiencia', 'summary'],
      },
    }),
  },
  {
    name: 'Workday',
    matches: (url) => /(myworkdayjobs\.com|wd5\.myworkdayjobs\.com)/i.test(url),
    fill: createFillHandler({
      selector: 'input:not([type="hidden"]):not([type="submit"]), textarea, select',
      extraAttrs: ['data-automation-id'],
      keywords: {
        name: ['name', 'full_name', 'nome'],
        email: ['email', 'e-mail'],
        phone: ['phone', 'telephone', 'mobile'],
        linkedin: ['linkedin', 'linkedin_url'],
        github: ['github', 'github_url'],
        skills: ['skills', 'habilidades', 'competencias', 'key-skills'],
        education: ['education', 'academic', 'formacao', 'estudos'],
        experience: ['experience', 'work-experience', 'experiencia', 'summary'],
      },
    }),
  },
  {
    name: 'Generic',
    matches: () => true,
    fill: createFillHandler({
      selector: 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]), textarea, select',
      useShadowDom: true,
      keywords: {
        name: ['name', 'nome', 'nombre', 'full name', 'full_name', '姓', '名前', '성명'],
        email: ['email', 'e-mail', 'correo', '邮件', 'メール', '이메일'],
        phone: ['phone', 'tel', 'telephone', 'mobile', 'celular', '电话', '電話', '전화'],
        linkedin: ['linkedin', 'linkedin url', 'linkedin profile'],
        github: ['github', 'github url', 'github profile'],
        skills: ['skills', 'habilidades', 'competencias', 'key-skills', 'technologies', 'ferramentas'],
        education: ['education', 'academic', 'formacao', 'estudos', 'degree', 'university', 'college', 'school'],
        experience: ['experience', 'work-experience', 'experiencia', 'summary', 'about', 'background'],
      },
    }),
  },
];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FILL_FORM') {
    const url = window.location.href;
    const handler = siteHandlers.find((h) => h.matches(url));
    const result = handler.fill(message.data);
    sendResponse({ filled: result.filled, total: result.total, handler: handler.name });
    startAutoFillObserver(message.data);
    return true;
  }
  if (message.type === 'SHOW_FIELD_MAPPER') {
    showFieldMapper(message.x || 0, message.y || 0);
    sendResponse({ success: true });
    return true;
  }
});
