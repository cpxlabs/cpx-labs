const NAME_KEYWORDS = ['name', 'full_name', 'nome', 'nombre', 'nom', '名字', '名前', '성함', 'navn', 'numm'];
const EMAIL_KEYWORDS = ['email', 'correo', 'e-mail', 'e-mail', '邮件', 'メール', '이메일', 'epost'];
const PHONE_KEYWORDS = ['phone', 'tel', 'telephone', 'celular', 'telefono', 'telefone', 'téléphone', '手机', '电话', '전화', 'tlf'];
const LINKEDIN_KEYWORDS = ['linkedin'];
const GITHUB_KEYWORDS = ['github'];
const SKILLS_KEYWORDS = ['skills', 'habilidades', 'competencias', 'key-skills', 'technologies', 'ferramentas', 'technical'];
const EDUCATION_KEYWORDS = ['education', 'academic', 'formacao', 'escolaridade', 'estudos', 'degree', 'university', 'college', 'school', 'curso'];
const EXPERIENCE_KEYWORDS = ['experience', 'work-experience', 'experiencia', 'historico', 'emprego', 'summary', 'about', 'background'];

const FIELD_DEFS = [
  { key: 'name', keywords: NAME_KEYWORDS },
  { key: 'email', keywords: EMAIL_KEYWORDS },
  { key: 'phone', keywords: PHONE_KEYWORDS },
  { key: 'linkedin', keywords: LINKEDIN_KEYWORDS },
  { key: 'github', keywords: GITHUB_KEYWORDS },
  { key: 'skills', keywords: SKILLS_KEYWORDS },
  { key: 'education', keywords: EDUCATION_KEYWORDS },
  { key: 'experience', keywords: EXPERIENCE_KEYWORDS },
];

function getLabelForElement(el) {
  if (el.id) {
    const labels = document.querySelectorAll('label');
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].htmlFor === el.id) return labels[i];
    }
  }
  let p = el.parentElement;
  while (p) {
    if (p.tagName === 'LABEL') return p;
    p = p.parentElement;
  }
  const by = el.getAttribute('aria-labelledby');
  if (by) {
    const lb = document.getElementById(by);
    if (lb) return lb;
  }
  return null;
}

function scoreElement(el, keywords) {
  let score = 0;
  const lowerKeywords = [];
  for (let i = 0; i < keywords.length; i++) {
    lowerKeywords[i] = keywords[i].toLowerCase().trim();
  }

  function checkValue(val, exactPts, subPts) {
    if (!val || typeof val !== 'string') return;
    const lower = val.toLowerCase().trim();
    for (let i = 0; i < lowerKeywords.length; i++) {
      if (lower === lowerKeywords[i]) { score += exactPts; return; }
    }
    for (let i = 0; i < lowerKeywords.length; i++) {
      if (lower.indexOf(lowerKeywords[i]) !== -1) { score += subPts; return; }
    }
  }

  checkValue(el.name, 100, 50);
  checkValue(el.id, 100, 50);
  checkValue(el.placeholder, 100, 50);
  checkValue(el.getAttribute('aria-label'), 100, 50);

  if (el.tagName === 'INPUT') {
    checkValue(el.type, 80, 40);
  }

  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (attr.name.indexOf('data-') === 0) {
      checkValue(attr.value, 60, 30);
    }
  }

  const label = getLabelForElement(el);
  if (label) {
    checkValue(label.textContent, 75, 30);
  }

  if (el.offsetParent !== null) {
    score += 10;
  }

  return score;
}

function findField(keywords) {
  const allFields = document.querySelectorAll('input, textarea, select');
  let best = null;
  let bestScore = 0;
  let bestIndex = -1;

  for (let i = 0; i < allFields.length; i++) {
    const el = allFields[i];
    const s = scoreElement(el, keywords);
    if (s > 0 && (best === null || s > bestScore || (s === bestScore && i < bestIndex))) {
      bestScore = s;
      best = el;
      bestIndex = i;
    }
  }

  return best;
}

function getFieldMappings(data) {
  return FIELD_DEFS.map(function(def) {
    return { field: findField(def.keywords), value: data[def.key] };
  });
}

function fillFields(data) {
  const mappings = getFieldMappings(data);
  let filled = 0;
  for (let i = 0; i < mappings.length; i++) {
    const m = mappings[i];
    if (m.field && m.value) {
      m.field.value = m.value;
      m.field.dispatchEvent(new Event('input', { bubbles: true }));
      m.field.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
    }
  }
  return filled;
}

function findAllFields(data) {
  const results = [];
  for (let d = 0; d < FIELD_DEFS.length; d++) {
    const def = FIELD_DEFS[d];
    const allFields = document.querySelectorAll('input, textarea, select');
    for (let i = 0; i < allFields.length; i++) {
      const el = allFields[i];
      const s = scoreElement(el, def.keywords);
      if (s > 0) {
        results.push({ key: def.key, field: el, score: s, value: data[def.key] });
      }
    }
  }
  results.sort(function(a, b) { return b.score - a.score; });
  return results;
}

function getFillScript() {
  return [
    'function getLabelForElement(el) {',
    '  if (el.id) {',
    '    var labels = document.querySelectorAll("label");',
    '    for (var i = 0; i < labels.length; i++) {',
    '      if (labels[i].htmlFor === el.id) return labels[i];',
    '    }',
    '  }',
    '  var p = el.parentElement;',
    '  while (p) {',
    '    if (p.tagName === "LABEL") return p;',
    '    p = p.parentElement;',
    '  }',
    '  var by = el.getAttribute("aria-labelledby");',
    '  if (by) {',
    '    var lb = document.getElementById(by);',
    '    if (lb) return lb;',
    '  }',
    '  return null;',
    '}',
    '',
    'function scoreElement(el, keywords) {',
    '  var score = 0;',
    '  var lowerKeywords = [];',
    '  for (var i = 0; i < keywords.length; i++) {',
    '    lowerKeywords[i] = keywords[i].toLowerCase().trim();',
    '  }',
    '  function checkValue(val, exactPts, subPts) {',
    '    if (!val || typeof val !== "string") return;',
    '    var lower = val.toLowerCase().trim();',
    '    for (var i = 0; i < lowerKeywords.length; i++) {',
    '      if (lower === lowerKeywords[i]) { score += exactPts; return; }',
    '    }',
    '    for (var i = 0; i < lowerKeywords.length; i++) {',
    '      if (lower.indexOf(lowerKeywords[i]) !== -1) { score += subPts; return; }',
    '    }',
    '  }',
    '  checkValue(el.name, 100, 50);',
    '  checkValue(el.id, 100, 50);',
    '  checkValue(el.placeholder, 100, 50);',
    '  checkValue(el.getAttribute("aria-label"), 100, 50);',
    '  if (el.tagName === "INPUT") {',
    '    checkValue(el.type, 80, 40);',
    '  }',
    '  for (var i = 0; i < el.attributes.length; i++) {',
    '    var attr = el.attributes[i];',
    '    if (attr.name.indexOf("data-") === 0) {',
    '      checkValue(attr.value, 60, 30);',
    '    }',
    '  }',
    '  var label = getLabelForElement(el);',
    '  if (label) {',
    '    checkValue(label.textContent, 75, 30);',
    '  }',
    '  if (el.offsetParent !== null) {',
    '    score += 10;',
    '  }',
    '  return score;',
    '}',
    '',
    'function findField(keywords) {',
    '  var allFields = document.querySelectorAll("input, textarea, select");',
    '  var best = null;',
    '  var bestScore = 0;',
    '  var bestIndex = -1;',
    '  for (var i = 0; i < allFields.length; i++) {',
    '    var el = allFields[i];',
    '    var s = scoreElement(el, keywords);',
    '    if (s > 0 && (best === null || s > bestScore || (s === bestScore && i < bestIndex))) {',
    '      bestScore = s;',
    '      best = el;',
    '      bestIndex = i;',
    '    }',
    '  }',
    '  return best;',
    '}',
    '',
    'function getFieldMappings(data) {',
    '  var defs = [',
    "    { key: 'name', keywords: ['name','full_name','nome','nombre','nom','\u540d\u5b57','\u540d\u524d','\uc131\ud568','navn','numm'] },",
    "    { key: 'email', keywords: ['email','correo','e-mail','e-mail','\u90ae\u4ef6','\u30e1\u30fc\u30eb','\uc774\uba54\uc77c','epost'] },",
    "    { key: 'phone', keywords: ['phone','tel','telephone','celular','telefono','telefone','t\u00e9l\u00e9phone','\u624b\u673a','\u7535\u8bdd','\uc804\ud654','tlf'] },",
    "    { key: 'linkedin', keywords: ['linkedin'] },",
    "    { key: 'github', keywords: ['github'] },",
    "    { key: 'skills', keywords: ['skills','habilidades','competencias','key-skills','technologies','ferramentas','technical'] },",
    "    { key: 'education', keywords: ['education','academic','formacao','escolaridade','estudos','degree','university','college','school','curso'] },",
    "    { key: 'experience', keywords: ['experience','work-experience','experiencia','historico','emprego','summary','about','background'] },",
    '  ];',
    '  var results = [];',
    '  for (var i = 0; i < defs.length; i++) {',
    '    results.push({ field: findField(defs[i].keywords), value: data[defs[i].key] });',
    '  }',
    '  return results;',
    '}',
    '',
    'function fillFields(data) {',
    '  var mappings = getFieldMappings(data);',
    '  var filled = 0;',
    '  for (var i = 0; i < mappings.length; i++) {',
    '    var m = mappings[i];',
    '    if (m.field && m.value) {',
    '      m.field.value = m.value;',
    '      m.field.dispatchEvent(new Event("input", { bubbles: true }));',
    '      m.field.dispatchEvent(new Event("change", { bubbles: true }));',
    '      filled++;',
    '    }',
    '  }',
    '  return filled;',
    '}',
    '',
    'return fillFields(arguments[0]);',
  ].join('\n');
}

if (typeof window !== 'undefined') {
  window.findField = findField;
  window.getFieldMappings = getFieldMappings;
  window.fillFields = fillFields;
  window.findAllFields = findAllFields;
  window.getFillScript = getFillScript;
}
if (typeof module !== 'undefined') {
  module.exports = { findField, getFieldMappings, fillFields, findAllFields, getFillScript };
}
