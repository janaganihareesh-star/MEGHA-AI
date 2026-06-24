/**
 * officialDraftService.js — Engine 45
 * Legal & Official Draft Engine: leave letters, complaints, applications, formal emails
 */

const axios = require('axios');

const DRAFT_TYPES = {
  leaveApplication: { label: 'Leave Application', formal: true },
  sickLeave: { label: 'Sick Leave Letter', formal: true },
  resignationLetter: { label: 'Resignation Letter', formal: true },
  complaintLetter: { label: 'Complaint Letter', formal: true },
  applicationLetter: { label: 'Application/Request Letter', formal: true },
  formalEmail: { label: 'Formal Email', formal: true },
  noc: { label: 'NOC Letter', formal: true },
  experienceLetter: { label: 'Experience Letter (HR template)', formal: true },
  internshipRequest: { label: 'Internship Request', formal: true },
  bankLetter: { label: 'Bank Letter / Account Statement Request', formal: true },
  officialRequest: { label: 'Official Request Letter', formal: true },
  tenantLetter: { label: 'Tenant/Landlord Communication', formal: true }
};

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') return { mock: true };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function generateDraft({ type, details, language = 'English' }) {
  const draftType = DRAFT_TYPES[type] || DRAFT_TYPES.officialRequest;

  const typeGuides = {
    leaveApplication: `Leave type: ${details.leaveType || 'casual'}. Dates: ${details.dates || ''}. Reason: ${details.reason || ''}.`,
    sickLeave: `Illness: ${details.illness || ''}. Duration: ${details.duration || ''}.`,
    resignationLetter: `Notice period: ${details.noticePeriod || '1 month'}. Reason: ${details.reason || 'personal'}.`,
    complaintLetter: `Issue: ${details.issue || ''}. Against: ${details.against || ''}. Date of incident: ${details.incidentDate || ''}.`,
    applicationLetter: `Purpose: ${details.purpose || ''}. Requesting: ${details.request || ''}.`,
    formalEmail: `Subject: ${details.subject || ''}. Main message: ${details.message || ''}.`,
    noc: `For: ${details.purpose || ''}.`,
    experienceLetter: `Employee: ${details.employeeName || ''}. Designation: ${details.designation || ''}. Duration: ${details.duration || ''}.`,
    internshipRequest: `Domain: ${details.domain || ''}. Duration: ${details.duration || ''}.`,
    bankLetter: `Account holder: ${details.name || ''}. Purpose: ${details.purpose || ''}.`,
  };

  const typeContext = typeGuides[type] || JSON.stringify(details);

  const prompt = `Write a professional ${draftType.label}.
Details: ${typeContext}
From: ${details.senderName || '[Sender Name]'} (${details.senderDesignation || ''})
To: ${details.recipientName || '[Recipient Name]'} (${details.recipientDesignation || ''})
Organization: ${details.organization || '[Organization Name]'}
Language: ${language}

Rules:
- Formal, professional tone
- Correct salutation and closing
- All necessary sections included
- No ambiguity or informal language

Return JSON:
{
  "documentType": "${draftType.label}",
  "date": "${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}",
  "subject": "string",
  "salutation": "string",
  "body": "string (complete body paragraphs)",
  "closing": "string",
  "formattedText": "string (complete ready-to-use letter/email)",
  "tips": [],
  "enclosures": []
}`;
  return callGemini(prompt, 1500);
}

async function getDraftTypes() {
  return { types: Object.entries(DRAFT_TYPES).map(([key, val]) => ({ key, ...val })) };
}

module.exports = { generateDraft, getDraftTypes, DRAFT_TYPES };
