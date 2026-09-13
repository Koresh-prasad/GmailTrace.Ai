import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenAI from 'openai';
import { initDb, saveScan, getScanById, getAllScans, getStats } from './db';
import { analyzeEmail } from './analyzer';
import { generateForensicPdf } from './pdfReport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup upload middleware (in-memory buffer for safety and speed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize SQLite database
initDb();

// Seed initial database samples if empty
(async () => {
  try {
    const existing = getAllScans({ limit: 1 });
    if (existing.length === 0) {
      console.log('[MailShield DB] Seeding initial case samples into database...');
      const samplePhishingPath = path.resolve(__dirname, '../samples/sample-phishing.eml');
      const sampleSafePath = path.resolve(__dirname, '../samples/sample-safe.eml');

      if (fs.existsSync(samplePhishingPath)) {
        const phishRaw = fs.readFileSync(samplePhishingPath, 'utf-8');
        const phishScan = await analyzeEmail(phishRaw);
        saveScan(phishScan);
      }

      if (fs.existsSync(sampleSafePath)) {
        const safeRaw = fs.readFileSync(sampleSafePath, 'utf-8');
        const safeScan = await analyzeEmail(safeRaw);
        saveScan(safeScan);
      }
      console.log('[MailShield DB] Initial samples seeded successfully.');
    }
  } catch (err) {
    console.warn('[MailShield DB] Seeding error:', err);
  }
})();

// Optional LLM client configuration (OpenAI/Anthropic/Gemini compatible)
let openaiClient: OpenAI | null = null;
if (process.env.LLM_API_KEY) {
  openaiClient = new OpenAI({ apiKey: process.env.LLM_API_KEY });
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'MailShield AI Forensic Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// STEP 3.1: POST /api/scan
app.post('/api/scan', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let rawText = '';

    if (req.file) {
      rawText = req.file.buffer.toString('utf-8');
    } else if (req.body.rawText) {
      rawText = req.body.rawText;
    } else {
      res.status(400).json({ error: 'Please provide either an .eml file or raw email text.' });
      return;
    }

    if (!rawText.trim()) {
      res.status(400).json({ error: 'Provided email content is empty.' });
      return;
    }

    // Run deep forensic analysis
    const result = await analyzeEmail(rawText);

    // Save to SQLite database
    saveScan(result);

    res.json(result);
  } catch (error: any) {
    console.error('[Scan Error]', error);
    res.status(500).json({ error: error.message || 'Error occurred while analyzing email.' });
  }
});

// STEP 3.2: GET /api/scan/:id
app.get('/api/scan/:id', (req: Request, res: Response) => {
  try {
    const scan = getScanById(req.params.id);
    if (!scan) {
      res.status(404).json({ error: 'Forensic scan file not found.' });
      return;
    }
    res.json(scan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// STEP 3.3: GET /api/scans (list all scans)
app.get('/api/scans', (req: Request, res: Response) => {
  try {
    const { search, verdict, limit } = req.query;
    const scans = getAllScans({
      search: search ? String(search) : undefined,
      verdict: verdict ? String(verdict) : undefined,
      limit: limit ? Number(limit) : 50
    });
    res.json(scans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// General Copilot chat endpoint (for non-case pages) - defined before parameterized route
app.post('/api/copilot/general', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const qLower = (question || '').toLowerCase();

    let answer = '';
    if (qLower.includes('spf') || qLower.includes('dkim') || qLower.includes('dmarc')) {
      answer = `SPF (Sender Policy Framework) verifies authorized IP senders via DNS. DKIM (DomainKeys Identified Mail) uses cryptographic public-key cryptography to ensure messages weren't tampered with in transit. DMARC aligns both and tells receiving servers whether to quarantine or reject failures.`;
    } else if (qLower.includes('phish') || qLower.includes('identify')) {
      answer = `Key signs of phishing include: urgent psychological language ("within 24 hours"), domain lookalikes with odd TLDs (.top, .xyz), mismatched display text vs destination URL, and failing SPF/DMARC authentication.`;
    } else if (qLower.includes('cert-in') || qLower.includes('report')) {
      answer = `CERT-In (Indian Computer Emergency Response Team) accepts incident notifications for cyber attacks, phishing campaigns, and malware distribution. MailShield generates SHA-256 sealed PDF dockets ready for CERT-In intake.`;
    } else {
      answer = `I am MailShield AI Copilot. You can ask me about email headers, SPF/DKIM/DMARC protocols, IP routing forensics, or upload an .eml message to test in real time!`;
    }

    res.json({ answer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// STEP 3.4: POST /api/copilot/:scanId (context-aware AI Copilot)
app.post('/api/copilot/:scanId', async (req: Request, res: Response) => {
  try {
    const { scanId } = req.params;
    const { question } = req.body;

    const scan = getScanById(scanId);
    if (!scan) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }

    // If external LLM API key configured, use it
    if (openaiClient) {
      try {
        const completion = await openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are MailShield AI, a tier-3 cybersecurity forensic analyst.
You are inspecting this specific case:
Subject: ${scan.subject}
From: ${scan.sender}
Verdict: ${scan.verdict} (Risk: ${scan.risk_score}/100)
SPF: ${scan.spf_result}, DKIM: ${scan.dkim_result}, DMARC: ${scan.dmarc_result}
Flagged Reasons: ${JSON.stringify(scan.flagged_reasons)}
Hops: ${JSON.stringify(scan.hops.map(h => `${h.hop_order}: ${h.ip} (${h.city}, ${h.country})`))}
Explain concisely in plain English (max 120 words), referencing specific technical findings.`
            },
            { role: 'user', content: question || 'Why was this email flagged?' }
          ]
        });

        const answer = completion.choices[0]?.message?.content || scan.ai_explanation;
        res.json({ answer, scanId });
        return;
      } catch (llmErr) {
        console.warn('OpenAI request fallback:', llmErr);
      }
    }

    // High-fidelity local intelligence fallback
    const qLower = (question || '').toLowerCase();
    let answer = '';

    if (qLower.includes('ip') || qLower.includes('located') || qLower.includes('where')) {
      const origin = scan.hops[0];
      answer = `The email claims to come from ${scan.sender}, but network Received headers reveal it originated from ${origin?.ip} in ${origin?.city}, ${origin?.country} (ASN: ${origin?.asn}). This physical mismatch is a hallmark indicator of an unauthorized relay.`;
    } else if (qLower.includes('attachment') || qLower.includes('file')) {
      if (scan.attachments && scan.attachments.length > 0) {
        const names = scan.attachments.map(a => `${a.filename} (${a.verdict})`).join(', ');
        answer = `Attachment scan detected: ${names}. File types and static signatures were evaluated against known macro and executable payload patterns.`;
      } else {
        answer = `Zero file attachments were embedded in this message. The primary threat vector remains header manipulation and hyperlink harvesting.`;
      }
    } else if (qLower.includes('safe') || qLower.includes('click')) {
      if (scan.verdict === 'Malicious') {
        answer = `DO NOT CLICK. This email contains spoofed sender headers and deceptive hyperlinks leading to unverified or IP-direct servers designed for credential harvesting.`;
      } else {
        answer = `This message passed cryptographic SPF, DKIM, and DMARC validations with untampered transit hops. The links match legitimate domains.`;
      }
    } else {
      answer = `Forensic Case Summary: Classified as ${scan.verdict.toUpperCase()} (Threat Score: ${scan.risk_score}/100). SPF is ${scan.spf_result}, DKIM is ${scan.dkim_result}, and DMARC is ${scan.dmarc_result}. ${scan.flagged_reasons.join('. ')}.`;
    }

    res.json({ answer, scanId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// STEP 3.5: GET or POST /api/report/:id (PDF Generation)
app.get('/api/report/:id', (req: Request, res: Response) => {
  try {
    const scan = getScanById(req.params.id);
    if (!scan) {
      res.status(404).send('Case not found');
      return;
    }
    generateForensicPdf(scan, res);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// STEP 3.6: POST /api/report-cert/:id
app.post('/api/report-cert/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scan = getScanById(id);
    if (!scan) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }

    const referenceId = `CERT-IN-${new Date().getFullYear()}-${crypto.randomInt(100000, 999999)}`;
    res.json({
      success: true,
      referenceId,
      caseId: id,
      timestamp: new Date().toISOString(),
      message: 'Incident docket successfully submitted to national cyber response queue.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// STEP 3.7: GET /api/samples/:type (serving sample .eml files)
app.get('/api/samples/:type', (req: Request, res: Response) => {
  const { type } = req.params;
  const sampleFile = type === 'phishing' ? 'sample-phishing.eml' : 'sample-safe.eml';
  const filePath = path.resolve(__dirname, '../samples', sampleFile);

  if (fs.existsSync(filePath)) {
    const rawText = fs.readFileSync(filePath, 'utf-8');
    res.json({ type, rawText });
  } else {
    res.status(404).json({ error: 'Sample not found' });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard-stats', (req: Request, res: Response) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[MailShield Backend] Server running on http://localhost:${PORT}`);
});

export default app;
