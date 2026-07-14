/**
 * Create minimal valid PDF files for e2e testing.
 * Uses raw PDF structure — no external libraries required.
 * Run: node tests/fixtures/create-pdfs.js
 */
const fs = require('fs');
const path = require('path');

const FIXTURES_DIR = __dirname;

function createPDF(textLines) {
  const textOps = textLines
    .filter(l => l.trim() !== '')
    .map(l => `(${l.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj`)
    .join(' T* ');
  
  const streamContent = `BT /F1 11 Tf 72 720 Td ${textOps} ET`;
  const streamLength = Buffer.byteLength(streamContent);

  const parts = [];
  let offset = 0;

  const header = '%PDF-1.4\n';
  offset += header.length;

  const objects = [];

  function addObj(num, content) {
    const str = `${num} 0 obj\n${content}\nendobj\n`;
    objects.push({ num, offset });
    offset += str.length;
    parts.push(str);
  }

  // Object 1: Catalog
  addObj(1, '<< /Type /Catalog /Pages 2 0 R >>');

  // Object 2: Pages
  addObj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');

  // Object 3: Page
  addObj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>');

  // Object 4: Content stream
  const streamObj = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;
  objects.push({ num: 4, offset });
  offset += streamObj.length;
  parts.push(streamObj);

  // Object 5: Font
  addObj(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  // xref
  const xrefOffset = offset;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (const obj of objects) {
    xref += `${String(obj.offset).padStart(10, '0')} 00000 n \n`;
  }
  offset += xref.length;
  parts.push(xref);

  // Trailer
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  parts.push(trailer);

  return Buffer.from(header + parts.join(''), 'utf-8');
}

const testPDFs = [
  {
    name: 'cv-english.pdf',
    lines: [
      'John Doe',
      'Software Engineer',
      'john.doe@example.com',
      '+1 555-123-4567',
      'linkedin.com/in/johndoe',
      'github.com/johndoe',
      '',
      'Skills: JavaScript, Python, React, Docker',
      'Senior Software Engineer at Acme Corp',
      '5 years of experience in full-stack development',
      'Bachelor of Science in Computer Science',
      'University of Technology',
    ],
  },
  {
    name: 'cv-french.pdf',
    lines: [
      'Marie Curie',
      'marie@example.com',
      '+33 6 12 34 56 78',
      'linkedin.com/in/mariecurie',
      'github.com/mariecurie',
      '',
      'Compétences: JavaScript, Python, React',
      'Expérience professionnelle: Développeur Full-Stack',
      '3 ans d expérience',
      'Formation: Master Informatique',
      'Université de Paris',
    ],
  },
  {
    name: 'cv-german.pdf',
    lines: [
      'Anna Schmidt',
      'anna.schmidt@example.com',
      '+49 30 123456',
      'linkedin.com/in/annaschmidt',
      'github.com/annaschmidt',
      '',
      'Fähigkeiten: JavaScript, Python, Docker, Kubernetes',
      'Berufserfahrung: Senior Entwickler bei Tech GmbH',
      '4 Jahre Erfahrung',
      'Bildung: Master of Science Informatik',
      'Technische Universität Berlin',
    ],
  },
  {
    name: 'cv-spanish.pdf',
    lines: [
      'Carlos García',
      'carlos.garcia@example.com',
      '+34 612 345 678',
      'linkedin.com/in/carlosgarcia',
      'github.com/carlosgarcia',
      '',
      'Habilidades: JavaScript, TypeScript, Angular, AWS',
      'Experiencia: Ingeniero Senior en Empresa Tech',
      '6 años de experiencia',
      'Educación: Grado en Ingeniería Informática',
      'Universidad Politécnica de Madrid',
    ],
  },
  {
    name: 'cv-minimal.pdf',
    lines: [
      'Jane Smith',
      'jane.smith@company.com',
      '+1 555-987-6543',
    ],
  },
  {
    name: 'cv-no-contact.pdf',
    lines: [
      'No Contact Info',
      'This CV has no email or phone',
      'Just some random text',
      'Skills: JavaScript, Python',
    ],
  },
  {
    name: 'cv-skills-heavy.pdf',
    lines: [
      'Dev Expert',
      'dev@example.com',
      '+1 555-0000',
      '',
      'Technical Skills: JavaScript, TypeScript, Python, Java',
      'React, Vue, Angular, Svelte, Node.js',
      'Docker, Kubernetes, AWS, GCP, Terraform',
      'PostgreSQL, MongoDB, Redis, Elasticsearch',
      'Machine Learning, Deep Learning, NLP',
      'TensorFlow, PyTorch, Scikit-learn',
    ],
  },
];

for (const pdf of testPDFs) {
  const buffer = createPDF(pdf.lines);
  const filePath = path.join(FIXTURES_DIR, pdf.name);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created: ${pdf.name} (${buffer.length} bytes)`);
}

// Corrupted PDF (invalid structure but has PDF header)
const corruptedPDF = Buffer.from('%PDF-1.4\nThis is not a valid PDF structure\nbroken xref\n%%EOF', 'utf-8');
fs.writeFileSync(path.join(FIXTURES_DIR, 'corrupted.pdf'), corruptedPDF);
console.log('Created: corrupted.pdf');

// Empty file
fs.writeFileSync(path.join(FIXTURES_DIR, 'empty.pdf'), Buffer.from(''));
console.log('Created: empty.pdf');

console.log(`\nGenerated ${testPDFs.length + 2} test PDFs in ${FIXTURES_DIR}`);
