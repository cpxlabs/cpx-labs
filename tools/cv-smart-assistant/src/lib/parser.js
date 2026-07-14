const EMAIL_RE = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
const PHONE_RE = /(?:(?:\+|00)\d{1,3}[\s.-]?)?\(?\d{1,6}\)?(?:[\s.-]?\d{2,6}){1,4}/;
const LINKEDIN_RE = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
const GITHUB_RE = /(github\.com\/[a-zA-Z0-9_-]+)/i;

const SKILL_TERMS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Ruby', 'Go', 'Rust',
  'Swift', 'Kotlin', 'PHP', 'HTML5?', 'CSS3?', 'SCSS', 'Sass', 'Less', 'Scala', 'Perl',
  'Haskell', 'Elixir', 'Clojure', 'R', 'MATLAB',
  'React', 'Vue', 'Angular', 'Svelte', 'Node\\.?js', 'Deno', 'Express',
  'Django', 'Flask', 'FastAPI', 'Spring', 'Spring\\s*Boot',
  'Ruby on Rails', 'ASP\\.NET', 'Laravel', 'Symfony', 'Next\\.?js', 'Nuxt',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible',
  'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis',
  'Elasticsearch', 'Cassandra', 'DynamoDB', 'Firebase',
  'Git', 'Agile', 'Scrum', 'Kanban',
  'Machine Learning', 'Artificial Intelligence', 'Deep Learning', 'NLP',
  'Computer Vision', 'Data Science', 'Data Engineering',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter',
  'GraphQL', 'REST', 'API', 'Microservices', 'CI/CD', 'Jenkins',
  'GitHub Actions', 'CircleCI', 'TravisCI',
  'Linux', 'Bash', 'Unix', 'PowerShell',
  'React Native', 'Flutter', 'Dart',
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
  'Jira', 'Confluence', 'Postman', 'Swagger',
  'Hadoop', 'Spark', 'Kafka', 'Airflow',
  'Blockchain', 'Solidity', 'Web3',
  'Leadership', 'Management', 'Communication', 'Teamwork',
];
const SKILL_RE = new RegExp(`\\b(${SKILL_TERMS.join('|')})(?!\\w)`, 'gi');
const EDU_RE = /((?:Bachelor|Master|PhD|Doctorate|Ph\.D|MBA|BSc|MSc|BA|MA|BE|ME|BTech|MTech|\bB\.\w+|\bM\.\w+|学位|学士|硕士|博士|大学|学院|University|College|Institute|School|Academy).{0,60})/gim;
const EXP_RE = /((?:\d+\+?\s*years?(?:\s*of)?\s*(?:experience|work))|(?:(?:Software|Senior|Lead|Principal|Junior|Full-?Stack|Frontend|Backend|DevOps|Data|Machine Learning|AI|Engineering)\s*(?:Engineer|Developer|Scientist|Analyst|Architect|Manager|Intern)))/gi;

function detectLanguage(text) {
  const langPatterns = {
    en: /(?:^|\n)\s*(?:education|experience|skills|work\s*experience|summary|objective|employment|projects|certifications|languages|references|profile|interests|publications)\b/im,
    zh: /(?:^|\n)\s*(?:教育|经历|技能|工作经历|项目经验|项目|证书|语言能力|语言|参考|个人资料|联系方式|自我介绍|求职意向|工作|实习|培训)/im,
    ja: /(?:^|\n)\s*(?:学歴|職歴|スキル|職務経歴|プロジェクト|資格|言語|自己紹介|連絡先|志望動機|研究|業績|趣味)/im,
    fr: /(?:^|\n)\s*(?:éducation|expérience|compétences|formation|projets|certifications|langues|références|profil|contact|stages|loisirs)\b/im,
    de: /(?:^|\n)\s*(?:bildung|erfahrung|fähigkeiten|berufserfahrung|projekte|zertifikate|sprachen|referenzen|profil|kontakt|ausbildung|praxis)\b/im,
    pt: /(?:^|\n)\s*(?:educação|experiência|habilidades|formação|projetos|certificações|idiomas|referências|perfil|contato|histórico)\b/im,
    es: /(?:^|\n)\s*(?:educación|experiencia|habilidades|formación|proyectos|certificaciones|idiomas|referencias|perfil|contacto|historial)\b/im,
  };
  let maxCount = 0;
  let detected = 'en';
  for (const [lang, re] of Object.entries(langPatterns)) {
    const count = (text.match(re) || []).length;
    if (count > maxCount) {
      maxCount = count;
      detected = lang;
    }
  }
  return detected;
}

function extractName(lines) {
  const prefixRe = /^(?:CV|Resume|Curriculum\s*Vitae|简历|履歴書|Résumé)[:\s-]*/i;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    if (EMAIL_RE.test(line)) continue;
    if (PHONE_RE.test(line)) continue;
    if (LINKEDIN_RE.test(line) || GITHUB_RE.test(line)) continue;
    if (/^https?:\/\//i.test(line)) continue;
    if (/^\d/.test(line)) continue;

    line = line.replace(prefixRe, '').trim();
    if (!line) continue;

    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ\s.'-]{2,50}$/.test(line)) {
      return line;
    }
  }
  return lines[0] || '';
}

function collectMatches(text, regex, transform) {
  const results = [];
  let match;
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((match = re.exec(text)) !== null) {
    const value = transform ? transform(match) : match[1] || match[0];
    if (value && !results.includes(value)) {
      results.push(value);
    }
  }
  return results;
}

function looksLikePhone(str) {
  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(str)) return false;
  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(str)) return false;
  const digits = str.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function parseCVText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const lang = detectLanguage(text);

  const name = extractName(lines);
  const emailMatch = text.match(EMAIL_RE);
  const phoneMatch = text.match(PHONE_RE);
  const linkedinMatch = text.match(LINKEDIN_RE);
  const githubMatch = text.match(GITHUB_RE);

  let phone = phoneMatch ? phoneMatch[0].trim() : '';
  if (phone && !looksLikePhone(phone)) phone = '';

  const skills = collectMatches(text, SKILL_RE, m => m[1]);
  const education = collectMatches(text, EDU_RE, m => m[1].trim());
  const experience = collectMatches(text, EXP_RE, m => m[1].trim());

  return {
    name: name.slice(0, 50),
    email: emailMatch ? emailMatch[0].trim() : '',
    phone,
    linkedin: linkedinMatch ? linkedinMatch[0].trim() : '',
    github: githubMatch ? githubMatch[0].trim() : '',
    skills,
    education,
    experience,
  };
}

if (typeof window !== 'undefined') {
  window.parseCVText = parseCVText;
  window.PHONE_RE = PHONE_RE;
}
if (typeof module !== 'undefined') {
  module.exports = { parseCVText, EMAIL_RE, PHONE_RE, LINKEDIN_RE, GITHUB_RE, SKILL_RE, EDU_RE, EXP_RE };
}
