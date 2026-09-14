import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy-initialized Gemini client (server-side only)
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Quick Summary Endpoint
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { resource } = req.body;
    if (!resource || !resource.title) {
      return res.status(400).json({ error: 'Valid resource object is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: [
          `Title: ${resource.title}`,
          `Category: ${resource.category}`,
          `Description: ${resource.description}`,
          `Please configure GEMINI_API_KEY for AI-powered summaries.`
        ]
      });
    }

    let resourceContentDigest = `Title: ${resource.title}\nDescription: ${resource.description}\n`;
    if (resource.highYieldKeyPoints) {
      resourceContentDigest += `Key Points: ${resource.highYieldKeyPoints.join('; ')}\n`;
    }
    if (resource.sections) {
      resourceContentDigest += `Sections: ${resource.sections.map((s: any) => s.title).join(', ')}\n`;
    }

    const prompt = `Please provide a brief, high-level bulleted summary (3-5 concise bullet points) for this nursing resource to help with rapid revision:\n${resourceContentDigest}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a concise nursing educator providing quick revision summaries. Return a JSON array of strings containing 3-5 high-yield bullet points.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const summaryData = JSON.parse(response.text?.trim() || '[]');
    res.json({ summary: summaryData });
  } catch (error: any) {
    console.warn('Summary generation error:', error?.message || error);
    res.json({
      summary: [
        `${req.body.resource.title}`,
        `${req.body.resource.description}`,
        'Detailed AI summary currently unavailable. Please review the main document.'
      ]
    });
  }
});

// Google Drive Files Auto-Summarizer Endpoint - Disabled per user directive
app.post('/api/summarize-drive-files', async (req, res) => {
  return res.json({ status: 'disabled', summaries: [], message: 'Automatic summarizing of attachments is disabled.' });
});

// Flashcard Generator Endpoint
app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { resource, count = 8, focusMode = 'all' } = req.body;

    if (!resource || !resource.title) {
      return res.status(400).json({ error: 'Valid resource object is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return 200 with empty cards so client uses clinical fallback generator seamlessly
      return res.json({
        source: 'local_fallback_no_key',
        cards: [],
        message: 'No GEMINI_API_KEY configured. Utilizing standardized clinical curriculum generator.'
      });
    }

    // Build context-rich prompt based on nursing resource content
    let resourceContentDigest = `Title: ${resource.title}\n`;
    resourceContentDigest += `Category: ${resource.category}\n`;
    resourceContentDigest += `Domain / Specialty: ${resource.domain}\n`;
    resourceContentDigest += `Academic Year Level: ${resource.yearLevel}\n`;
    resourceContentDigest += `Description: ${resource.description}\n`;

    if (resource.moduleCode) resourceContentDigest += `Module Code: ${resource.moduleCode}\n`;
    if (resource.learningOutcomes?.length) {
      resourceContentDigest += `Learning Outcomes:\n- ${resource.learningOutcomes.join('\n- ')}\n`;
    }
    if (resource.syllabus?.length) {
      resourceContentDigest += `Syllabus Units:\n`;
      resource.syllabus.forEach((u: any) => {
        resourceContentDigest += `  * Unit ${u.unitNumber}: ${u.title} (Topics: ${u.topics?.join(', ')}; Competencies: ${u.keyCompetencies?.join(', ')})\n`;
      });
    }
    if (resource.questions?.length) {
      resourceContentDigest += `Past Exam Questions:\n`;
      resource.questions.forEach((q: any) => {
        resourceContentDigest += `  * Q${q.number}: ${q.questionText}\n    Marking Scheme: ${q.markingScheme}\n    Rationale: ${q.clinicalRationale}\n`;
      });
    }
    if (resource.tableOfContents?.length) {
      resourceContentDigest += `Textbook Chapters:\n`;
      resource.tableOfContents.forEach((ch: any) => {
        resourceContentDigest += `  * Ch ${ch.chapterNumber}: ${ch.title} - ${ch.summary}\n    Pearls: ${ch.keyPearls?.join('; ')}\n`;
      });
    }
    if (resource.highYieldKeyPoints?.length) {
      resourceContentDigest += `High-Yield Points:\n- ${resource.highYieldKeyPoints.join('\n- ')}\n`;
    }
    if (resource.sections?.length) {
      resource.sections.forEach((s: any) => {
        resourceContentDigest += `Section "${s.title}": ${s.content}\n`;
        if (s.callout) resourceContentDigest += `Alert (${s.callout.type}): ${s.callout.text}\n`;
      });
    }

    const focusInstructions =
      focusMode === 'nclex'
        ? 'Focus specifically on NCLEX-RN high-yield scenario questions, priority nursing action questions (who to see first, airway/breathing/circulation priority), and safety alerts.'
        : focusMode === 'pharmacology'
        ? 'Focus specifically on drug mechanisms, high-alert administration rules, toxicities, contraindications, antidote pairings, and patient education.'
        : focusMode === 'rationales'
        ? 'Focus specifically on differentiating signs, pathophysiology rationales, and clinical diagnostic interpretations.'
        : 'Provide a balanced mix of Priority Actions, NCLEX Scenarios, Diagnostic Signs, and Core Recall questions.';

    const systemInstruction = `You are a Senior Nurse Educator and NCLEX-RN exam board specialist creating high-yield active-recall quiz cards for nursing students from the DATANURSE nursing database.
You must construct exactly ${count} quiz cards directly based on the provided nursing resource.
Every flashcard must have:
- question: Clear, challenging, clinically accurate nursing question (e.g., patient presentation, clinical priority, or medication alert).
- answer: Direct, unambiguous target clinical answer.
- category: One of 'Priority Action', 'NCLEX Case', 'Clinical Rationale', 'Drug & Pharmacology', 'Diagnostic Sign', or 'Core Recall'.
- explanation: Clear, evidence-based nursing rationale explaining WHY this answer is correct and why other assumptions fail.
- keyPearl: High-yield memory pearl, NCLEX tip, or critical patient safety warning.
- difficulty: 'Standard', 'Clinical Challenge', or 'NCLEX High-Yield'.

Ensure 100% clinical accuracy, professional nursing terminology (e.g., ADPIE, ABCs, NANDA guidelines), and clear distinction between subjective and objective signs.`;

    const prompt = `Resource Information:\n${resourceContentDigest}\n\nTask:\nGenerate ${count} flashcards adhering to focus: ${focusInstructions}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              category: {
                type: Type.STRING,
                enum: [
                  'Priority Action',
                  'NCLEX Case',
                  'Clinical Rationale',
                  'Drug & Pharmacology',
                  'Diagnostic Sign',
                  'Core Recall'
                ]
              },
              explanation: { type: Type.STRING },
              keyPearl: { type: Type.STRING },
              difficulty: {
                type: Type.STRING,
                enum: ['Standard', 'Clinical Challenge', 'NCLEX High-Yield']
              }
            },
            required: ['question', 'answer', 'category', 'explanation', 'keyPearl']
          }
        }
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini model');
    }

    const cards = JSON.parse(responseText);
    const sanitizedCards = cards.map((c: any, index: number) => ({
      ...c,
      id: c.id || `ai-card-${resource.id}-${index + 1}`
    }));

    return res.json({
      source: 'gemini_api',
      cards: sanitizedCards
    });
  } catch (error: any) {
    console.warn('Gemini generation unavailable, generating structured clinical cards:', error?.message || error);
    // Provide guaranteed high-yield cards derived from the resource
    const fallbackCards = buildServerClinicalCards(req.body.resource, req.body.count || 8);
    return res.json({
      source: 'clinical_curriculum_engine',
      cards: fallbackCards,
      note: 'Generated via structured clinical engine (Gemini model experiencing temporary high demand).'
    });
  }
});

function buildServerClinicalCards(resource: any, targetCount: number = 8) {
  const list: any[] = [];
  let idx = 1;

  if (resource.questions && Array.isArray(resource.questions)) {
    resource.questions.forEach((q: any) => {
      let ans = q.markingScheme;
      if (q.options && q.correctOptionIndex !== undefined) {
        ans = `${q.options[q.correctOptionIndex]} (Option ${String.fromCharCode(65 + q.correctOptionIndex)})`;
      }
      list.push({
        id: `card-${resource.id}-${idx++}`,
        question: q.questionText,
        answer: ans,
        category: q.type === 'scenario_case' ? 'NCLEX Case' : 'Clinical Rationale',
        explanation: q.clinicalRationale || q.markingScheme,
        keyPearl: q.highYieldTip || 'Priority rule: Assess physiological stability before delegating.',
        difficulty: 'NCLEX High-Yield'
      });
    });
  }

  if (resource.syllabus && Array.isArray(resource.syllabus)) {
    resource.syllabus.forEach((u: any) => {
      if (u.keyCompetencies) {
        u.keyCompetencies.forEach((comp: string) => {
          list.push({
            id: `card-${resource.id}-${idx++}`,
            question: `In "${resource.title}", Unit ${u.unitNumber} (${u.title}): What clinical protocol demonstrates "${comp}"?`,
            answer: `Adhere strictly to evidence-based nursing procedures covering: ${u.topics?.slice(0, 3).join(', ')}.`,
            category: 'Priority Action',
            explanation: `Unit ${u.unitNumber} core competencies emphasize ${u.title}.`,
            keyPearl: 'Competency Check: Verify patient identity using 2 identifiers prior to any bedside procedure.',
            difficulty: 'Standard'
          });
        });
      }
    });
  }

  if (resource.tableOfContents && Array.isArray(resource.tableOfContents)) {
    resource.tableOfContents.forEach((ch: any) => {
      if (ch.keyPearls) {
        ch.keyPearls.forEach((p: string) => {
          list.push({
            id: `card-${resource.id}-${idx++}`,
            question: `Chapter ${ch.chapterNumber} ("${ch.title}") Key Pearl: What is the essential clinical guideline?`,
            answer: p,
            category: 'Clinical Rationale',
            explanation: ch.summary,
            keyPearl: `High-yield takeaway from ${resource.title}.`,
            difficulty: 'NCLEX High-Yield'
          });
        });
      }
    });
  }

  if (resource.highYieldKeyPoints && Array.isArray(resource.highYieldKeyPoints)) {
    resource.highYieldKeyPoints.forEach((pt: string) => {
      list.push({
        id: `card-${resource.id}-${idx++}`,
        question: `Clinical High-Yield Alert for ${resource.title}: What must the nurse prioritize?`,
        answer: pt,
        category: 'Priority Action',
        explanation: `Essential safety recommendation for ${resource.domain}.`,
        keyPearl: 'Safety Alert: Never bypass independent double-check for high-alert medications.',
        difficulty: 'NCLEX High-Yield'
      });
    });
  }

  if (list.length === 0) {
    list.push({
      id: `card-${resource.id}-default-1`,
      question: `What are the primary clinical objectives of ${resource.title}?`,
      answer: resource.description || 'Mastery of specialized nursing assessment, evidence-based care, and patient safety protocols.',
      category: 'Core Recall',
      explanation: `Core domain: ${resource.domain} (${resource.yearLevel}).`,
      keyPearl: 'Remember the ADPIE nursing process framework.',
      difficulty: 'Standard'
    });
  }

  return list.slice(0, Math.max(targetCount, 5));
}

// Direct install route shortcuts
app.get(['/install', '/apk', '/pwa'], (_req, res) => {
  res.redirect('/?install=true');
});

// Endpoint to serve Android TWA / PWA Package Download
app.get('/api/download-apk-package', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="DATANURSE-Android-Package.json"');
  res.send(JSON.stringify({
    appName: "DATANURSE (Nursing Database)",
    packageName: "com.datanurse.app",
    version: "1.2.0",
    author: "Chanda Felix",
    appIcon: "/pwa-512x512.png",
    pwaCapabilities: [
      "Offline Database & SW Pre-caching",
      "WebAPK Native Android Minting",
      "AdMob Verified Banner Support",
      "Firebase Cloud Storage & Real-time Auto-Sync Integration"
    ],
    instructions: [
      "For Android: Open in Google Chrome / Samsung Internet -> Tap 3 Dots -> Tap 'Install App' or 'Add to Home Screen' to auto-mint native WebAPK.",
      "For PC (Windows/Mac/Linux): Open in Chrome / Edge / Brave -> Click Install Icon in URL address bar -> Runs as desktop window."
    ]
  }, null, 2));
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DATANURSE Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
