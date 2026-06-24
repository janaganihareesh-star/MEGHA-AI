/**
 * documentGenerationService.js — Engine 35
 * Generates professional documents using Gemini AI
 * Exports: PDF, DOCX, TXT, Markdown
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ─── Gemini helper ─────────────────────────────────────────────────────────
async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { mock: true, text: 'Configure GEMINI_API_KEY to generate real documents.' };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

// ─── DOCUMENT PROMPTS ──────────────────────────────────────────────────────

const PROMPTS = {
  resume: (d, lang) => `Generate a professional ATS-optimized resume.
User details: ${JSON.stringify(d)}
Template: ${d.template || 'Modern'}
Language: ${lang}
Rules:
- Strong action verbs: Architected/Engineered/Optimized/Delivered
- Quantify every achievement with numbers/percentages
- ATS keywords for role: ${d.targetRole || 'software engineer'}
- Order: Summary → Skills → Experience → Projects → Education → Certifications

Return JSON: {
  "documentType": "resume",
  "title": "${d.name || 'Professional'} — Resume",
  "sections": {
    "summary": "3-sentence professional summary",
    "skills": { "Frontend": [], "Backend": [], "Cloud": [], "Tools": [] },
    "experience": [{"company":"","role":"","dates":"","bullets":[]}],
    "projects": [{"name":"","tech":[],"description":"","bullets":[]}],
    "education": [{"degree":"","institution":"","year":"","gpa":""}],
    "certifications": []
  },
  "formattedText": "complete plain-text resume ready to copy",
  "atsScore": 0,
  "atsKeywords": [],
  "wordCount": 0
}`,

  cv: (d, lang) => `Generate a comprehensive academic/professional CV.
User details: ${JSON.stringify(d)}
Language: ${lang}
CV includes more detail than a resume — research, publications, presentations, awards.

Return JSON: {
  "documentType": "cv",
  "title": "${d.name || 'Dr./Mr./Ms.'} — Curriculum Vitae",
  "sections": {
    "personalInfo": {"name":"","email":"","phone":"","linkedin":"","github":"","website":""},
    "objective": "",
    "education": [{"degree":"","institution":"","year":"","grade":"","thesis":""}],
    "experience": [{"organization":"","role":"","period":"","responsibilities":[]}],
    "research": [{"title":"","description":"","year":""}],
    "publications": [],
    "presentations": [],
    "certifications": [],
    "awards": [],
    "skills": [],
    "languages": [],
    "references": "Available upon request"
  },
  "formattedText": "complete formatted CV plain text",
  "wordCount": 0
}`,

  coverLetter: (d, lang) => `Write a compelling cover letter.
Applicant: ${d.name}, applying for: ${d.targetRole} at ${d.company}
Resume summary: ${d.resumeSummary || ''}
Tone: ${d.tone || 'professional'}
Language: ${lang}
NEVER start with "I am writing to apply". Start with impact.

Return JSON: {
  "documentType": "coverLetter",
  "title": "Cover Letter — ${d.targetRole} at ${d.company}",
  "subject": "Application for ${d.targetRole} Position — ${d.name}",
  "salutation": "Dear Hiring Manager,",
  "body": "full 3-4 paragraph cover letter body",
  "closing": "professional closing",
  "formattedText": "complete formatted cover letter",
  "wordCount": 0
}`,

  sop: (d, lang) => `Write a compelling Statement of Purpose (SOP) for graduate/university admission.
Applicant: ${d.name}
Program: ${d.program || 'MS Computer Science'}
University: ${d.university || ''}
Background: ${JSON.stringify(d.background || {})}
Goals: ${d.goals || ''}
Language: ${lang}

Structure: Introduction hook → Academic background → Research/work experience → Why this program/university → Career goals → Closing
Length: 800-1000 words

Return JSON: {
  "documentType": "sop",
  "title": "Statement of Purpose — ${d.program}",
  "body": "complete SOP text (800-1000 words)",
  "formattedText": "formatted SOP with paragraphs",
  "wordCount": 0,
  "strengthPoints": [],
  "suggestions": []
}`,

  lor: (d, lang) => `Write a strong Letter of Recommendation (LOR).
Recommender: ${d.recommenderName} (${d.recommenderTitle} at ${d.recommenderOrg})
Candidate: ${d.candidateName}
Relationship: ${d.relationship || 'student/mentor'}
Program applying to: ${d.program || ''}
Candidate strengths: ${JSON.stringify(d.strengths || [])}
Language: ${lang}

Return JSON: {
  "documentType": "lor",
  "title": "Letter of Recommendation — ${d.candidateName}",
  "header": "official letter header",
  "body": "full LOR body (3-4 paragraphs)",
  "closing": "formal closing",
  "formattedText": "complete formatted LOR",
  "wordCount": 0
}`,

  biodata: (d, lang) => `Generate a professional bio-data document.
User details: ${JSON.stringify(d)}
Language: ${lang}
Include: personal details, education, work experience, skills, hobbies, references

Return JSON: {
  "documentType": "biodata",
  "title": "${d.name || 'Candidate'} — Bio-Data",
  "sections": {
    "personalDetails": {},
    "education": [],
    "workExperience": [],
    "skills": [],
    "achievements": [],
    "hobbies": [],
    "references": []
  },
  "formattedText": "complete formatted bio-data",
  "wordCount": 0
}`,

  portfolio: (d, lang) => `Generate professional portfolio content.
Developer/Designer: ${d.name}
Role: ${d.role || 'Full Stack Developer'}
Projects: ${JSON.stringify(d.projects || [])}
Skills: ${JSON.stringify(d.skills || [])}
Language: ${lang}

Return JSON: {
  "documentType": "portfolio",
  "title": "${d.name || 'Developer'} Portfolio",
  "hero": {"headline":"","tagline":"","ctaText":""},
  "about": {"bio":"","highlights":[]},
  "projects": [{"name":"","description":"","tech":[],"liveUrl":"","githubUrl":"","impact":""}],
  "skills": {"categories":[]},
  "experience": [],
  "testimonials": [],
  "contact": {},
  "formattedText": "complete portfolio description text",
  "wordCount": 0
}`
};

// ─── EXPORT HELPERS ────────────────────────────────────────────────────────

function toMarkdown(doc) {
  const d = doc.sections || {};
  let md = `# ${doc.title}\n\n`;
  if (doc.sections?.summary) md += `## Summary\n${doc.sections.summary}\n\n`;
  if (doc.body) md += `${doc.body}\n\n`;
  if (doc.formattedText && !doc.body) md += doc.formattedText;
  return md;
}

function toTxt(doc) {
  return doc.formattedText || doc.body || JSON.stringify(doc, null, 2);
}

async function toDocx(doc) {
  try {
    const { Document, Paragraph, TextRun, HeadingLevel, Packer } = require('docx');
    const lines = (doc.formattedText || doc.body || '').split('\n');

    const children = lines.map(line => {
      if (line.startsWith('# ')) {
        return new Paragraph({ text: line.replace('# ', ''), heading: HeadingLevel.HEADING_1 });
      } else if (line.startsWith('## ')) {
        return new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2 });
      } else if (line.startsWith('### ')) {
        return new Paragraph({ text: line.replace('### ', ''), heading: HeadingLevel.HEADING_3 });
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        return new Paragraph({ text: line.replace(/^[-•]\s/, ''), bullet: { level: 0 } });
      } else {
        return new Paragraph({ children: [new TextRun({ text: line })] });
      }
    });

    const document = new Document({ sections: [{ children }] });
    return await Packer.toBuffer(document);
  } catch {
    // Fallback if docx not installed
    return Buffer.from(doc.formattedText || '');
  }
}

async function toPdf(doc) {
  try {
    const PDFDocument = require('pdfkit');
    return new Promise((resolve, reject) => {
      const pdfDoc = new PDFDocument({ margin: 50 });
      const chunks = [];
      pdfDoc.on('data', c => chunks.push(c));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      pdfDoc.fontSize(20).font('Helvetica-Bold').text(doc.title || 'Document', { align: 'center' });
      pdfDoc.moveDown();
      pdfDoc.fontSize(11).font('Helvetica');

      const text = doc.formattedText || doc.body || '';
      const lines = text.split('\n');
      lines.forEach(line => {
        if (line.trim() === '') { pdfDoc.moveDown(0.4); return; }
        if (line.startsWith('## ') || line.toUpperCase() === line.trim()) {
          pdfDoc.fontSize(13).font('Helvetica-Bold').text(line.replace(/^#+\s/, ''));
          pdfDoc.fontSize(11).font('Helvetica');
        } else {
          pdfDoc.text(line);
        }
      });
      pdfDoc.end();
    });
  } catch {
    return Buffer.from(doc.formattedText || '');
  }
}

// ─── MAIN GENERATE FUNCTION ────────────────────────────────────────────────
async function generateDocument({ type, userDetails, language = 'English', template = 'Modern' }) {
  const promptFn = PROMPTS[type];
  if (!promptFn) throw new Error(`Unknown document type: ${type}`);

  const details = { ...userDetails, template };
  const prompt = promptFn(details, language);
  const result = await callGemini(prompt, 3000);

  return {
    ...result,
    generatedAt: new Date().toISOString(),
    template,
    language
  };
}

module.exports = {
  generateDocument,
  toMarkdown,
  toTxt,
  toDocx,
  toPdf,
  SUPPORTED_TYPES: ['resume', 'cv', 'coverLetter', 'sop', 'lor', 'biodata', 'portfolio']
};
