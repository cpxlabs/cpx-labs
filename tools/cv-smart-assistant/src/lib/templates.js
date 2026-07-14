function generateEmail({ job, name, email, phone, linkedin }) {
  const j = job || '[Target Role / Company]';
  const n = name || '[Your Name]';
  const e = email || '[Your Email]';
  const p = phone || '[Your Phone]';
  const l = linkedin || '[Your LinkedIn]';

  return [
    'Dear Hiring Manager,',
    '',
    `I am writing to express my interest in the ${j} position.`,
    '',
    'Please find my resume attached for your review. My background aligns well with the requirements for this role, and I would welcome the opportunity to discuss how my skills can contribute to your team.',
    '',
    'Professional Links:',
    `- LinkedIn: ${l}`,
    '',
    'Thank you for your time and consideration.',
    '',
    'Best regards,',
    n,
    `${e} | ${p}`,
  ].join('\n');
}

if (typeof window !== 'undefined') {
  window.generateEmail = generateEmail;
}

if (typeof module !== 'undefined') {
  module.exports = { generateEmail };
}
