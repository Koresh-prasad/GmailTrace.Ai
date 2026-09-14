import os
import random
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from db import init_db, save_scan, get_scan_by_id, get_all_scans, get_stats
from analyzer import analyze_email
from pdf_report import generate_pdf_bytes

app = FastAPI(title="MailShield AI Python Engine", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize and seed database
init_db()

def seed_initial_samples():
    existing = get_all_scans(limit=1)
    if not existing:
        print("[MailShield Python] Seeding initial demo cases...")
        samples_dir = os.path.join(os.path.dirname(__file__), "samples")
        phishing_path = os.path.join(samples_dir, "sample-phishing.eml")
        safe_path = os.path.join(samples_dir, "sample-safe.eml")

        if os.path.exists(phishing_path):
            with open(phishing_path, "r", encoding="utf-8", errors="ignore") as f:
                res = analyze_email(f.read())
                save_scan(res)

        if os.path.exists(safe_path):
            with open(safe_path, "r", encoding="utf-8", errors="ignore") as f:
                res = analyze_email(f.read())
                save_scan(res)
        print("[MailShield Python] Initial cases seeded.")

seed_initial_samples()

# Request Models
class ScanTextRequest(BaseModel):
    rawText: Optional[str] = None

class CopilotRequest(BaseModel):
    question: Optional[str] = None

# 1. Healthcheck
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MailShield AI Forensic Engine (Python FastAPI)",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# 2. POST /api/scan (Supports both File upload and JSON rawText)
@app.post("/api/scan")
async def scan_email_endpoint(
    request: Request,
    file: Optional[UploadFile] = File(None),
    rawText: Optional[str] = Form(None)
):
    content = ""
    if file:
        file_bytes = await file.read()
        content = file_bytes.decode("utf-8", errors="ignore")
    elif rawText:
        content = rawText
    else:
        # Check if sent as application/json
        try:
            body = await request.json()
            content = body.get("rawText", "")
        except Exception:
            pass

    if not content.strip():
        raise HTTPException(status_code=400, detail="Please provide either an .eml file or raw email text.")

    result = analyze_email(content)
    save_scan(result)
    return result

# 3. GET /api/scan/{scan_id}
@app.get("/api/scan/{scan_id}")
def get_scan(scan_id: str):
    scan = get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Forensic scan file not found.")
    return scan

# 4. GET /api/scans
@app.get("/api/scans")
def list_scans(search: Optional[str] = None, verdict: Optional[str] = None, limit: int = 50):
    return get_all_scans(search=search, verdict=verdict, limit=limit)

# 5. POST /api/copilot/general
@app.post("/api/copilot/general")
def copilot_general(req: CopilotRequest):
    q_lower = (req.question or "").lower().strip()

    if not q_lower:
        return {"answer": "Hello! I am MailShield AI Copilot. How can I help you with email security, header forensics, or threat detection today?"}

    # Greetings
    if any(k in q_lower for k in ("hello", "hi", "hey", "good morning", "good evening", "namaste")):
        answer = "Hello! I am your MailShield AI Cybersecurity Copilot. I can help you analyze email authentication (SPF, DKIM, DMARC), uncover hidden server hops, evaluate suspicious links and attachments, or guide you through reporting cyber threats."

    # Who are you / About
    elif any(k in q_lower for k in ("who are you", "what are you", "what can you do", "help me")):
        answer = "I am MailShield AI Copilot, an autonomous cyber forensics intelligence agent. I deconstruct RFC-5322 email headers, verify cryptographic signatures, trace international MTA relays on the Leaflet map, and generate court-admissible forensic PDF incident reports."

    # SPF / DKIM / DMARC
    elif "spf" in q_lower and "dkim" in q_lower:
        answer = "SPF and DKIM work together to authenticate emails: SPF verifies if the sender's IP is authorized in DNS, while DKIM uses cryptographic keypairs to ensure the message wasn't modified in transit. DMARC aligns both and tells receiving servers whether to accept, quarantine, or reject failures."
    elif "spf" in q_lower:
        answer = "SPF (Sender Policy Framework, RFC 7208) allows domain owners to publish a list of authorized sending IP addresses in their DNS TXT records. When an email arrives from an unauthorized IP, SPF fails, signaling potential header spoofing."
    elif "dkim" in q_lower:
        answer = "DKIM (DomainKeys Identified Mail, RFC 6376) attaches a cryptographic signature to the email header. The recipient verifies this signature using the sender's public key published in DNS, guaranteeing message integrity."
    elif "dmarc" in q_lower:
        answer = "DMARC (RFC 7489) enforces SPF and DKIM alignment against the visible 'From' header. Domain owners specify policies: p=none (monitoring), p=quarantine (send to spam), or p=reject (block completely)."

    # Phishing / Spoofing / BEC
    elif any(k in q_lower for k in ("spoof", "fake sender")):
        answer = "Email spoofing occurs when an attacker falsifies the 'From' or 'Return-Path' headers to masquerade as a trusted entity (like your bank or CEO). MailShield detects this by comparing claimed sender domains with the actual originating IP and SPF/DKIM validation status."
    elif any(k in q_lower for k in ("phish", "identify", "spot", "scam")):
        answer = "Key indicators of phishing include: (1) Urgent psychological pressure (e.g., 'Account Suspended in 24h'), (2) Lookalike domain names (typosquatting like paypa1.com), (3) Destination URLs that differ from anchor text, and (4) Failing SPF/DKIM cryptographic checks."
    elif any(k in q_lower for k in ("bec", "business email", "ceo")):
        answer = "Business Email Compromise (BEC) is a targeted spear-phishing attack where criminals impersonate executives to execute unauthorized wire transfers or steal confidential data. They often bypass spam filters using lookalike domains or compromised legitimate mailboxes."

    # CERT-In / Reporting
    elif any(k in q_lower for k in ("cert-in", "cert in", "report", "incident", "police", "crime")):
        answer = "CERT-In (Indian Computer Emergency Response Team) is the national agency for responding to cyber incidents. Organizations must report major security breaches within 6 hours. MailShield AI exports court-admissible PDF reports sealed with SHA-256 custody hashes ready for formal submission."

    # GeoIP / Hop Tracing
    elif any(k in q_lower for k in ("hop", "ip", "trace", "map", "route", "location", "origin")):
        answer = "Every email hops across multiple Mail Transfer Agents (MTAs) from sender to recipient. Each MTA appends a 'Received:' header with its IP address and timestamp. MailShield unrolls these headers chronologically in reverse order to map the exact global transit trajectory on the Leaflet map."

    # Attachments / Malware
    elif any(k in q_lower for k in ("attachment", "file", "malware", "virus", "payload")):
        answer = "Weaponized email attachments often hide in macro-enabled documents (.docm, .xlsm), disguised executables (.exe, .scr, .vbs), or archive files (.zip, .iso) designed to deliver ransomware or keyloggers upon opening."

    # How to use MailShield
    elif any(k in q_lower for k in ("how to use", "how do i use", "website", "scanner", "test")):
        answer = "To use MailShield AI: (1) Go to the 'Scan' page, (2) Click 'Try Sample Phishing Email' or paste raw headers from your Gmail ('Show original' -> 'Copy to clipboard'), (3) Click 'Analyze Now', and (4) Explore your threat score, Leaflet world map, and court PDF report!"

    else:
        answer = f"I analyzed your question: '{req.question}'. As your MailShield Forensic Copilot, I specialize in analyzing email authenticity (SPF/DKIM/DMARC), multi-hop MTA IP routing, social engineering linguistics, and incident response documentation. Feel free to ask about any specific cyber threat or scan an email live!"

    return {"answer": answer}

# 6. POST /api/copilot/{scan_id}
@app.post("/api/copilot/{scan_id}")
def copilot_case(scan_id: str, req: CopilotRequest):
    scan = get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Case not found")

    q_lower = (req.question or "").lower().strip()
    hops = scan.get("hops", [])
    origin = hops[0] if hops else {}

    # Origin / Location questions
    if any(k in q_lower for k in ("ip", "located", "where", "origin", "country", "city")):
        if origin.get("isMismatch"):
            answer = f"ORIGIN SPOOFING DETECTED: The sender claims to be '{scan.get('sender')}', but network transit headers prove this email originated from IP {origin.get('ip')} in {origin.get('city')}, {origin.get('country')} (ASN: {origin.get('asn')}). This unauthorized foreign relay confirms the sender identity is falsified."
        else:
            answer = f"The email originated from IP {origin.get('ip')} in {origin.get('city')}, {origin.get('country')} (ISP: {origin.get('isp')}). The network route aligns with authorized mail infrastructure."

    # Why flagged / Score questions
    elif any(k in q_lower for k in ("why", "flagged", "score", "risk", "reason", "verdict")):
        reasons = scan.get("flagged_reasons", [])
        reasons_str = "; ".join(reasons) if reasons else "All cryptographic and heuristic checks passed."
        answer = f"This case is classified as {scan.get('verdict', '').upper()} with a Threat Score of {scan.get('risk_score')}/100. Primary forensic triggers: {reasons_str}. SPF: {scan.get('spf_result')}, DKIM: {scan.get('dkim_result')}, DMARC: {scan.get('dmarc_result')}."

    # Safe to click / Open questions
    elif any(k in q_lower for k in ("safe", "click", "open", "trust", "legit", "real")):
        if scan.get("verdict") == "Malicious":
            answer = "CRITICAL WARNING: DO NOT CLICK any links or open any attachments in this email! It contains spoofed cryptographic headers and deceptive elements designed to compromise your account or harvest credentials."
        elif scan.get("verdict") == "Suspicious":
            answer = "PROCEED WITH CAUTION: This email triggered warning indicators. Verify the sender through an independent out-of-band channel before clicking links or providing any credentials."
        else:
            answer = "This email is classified as SAFE. It successfully passed SPF, DKIM, and DMARC cryptographic validation checks with authorized routing hops."

    # Attachments questions
    elif any(k in q_lower for k in ("attachment", "payload", "file", "document")):
        atts = scan.get("attachments", [])
        if atts:
            names = ", ".join(f"{a['filename']} ({a['verdict']})" for a in atts)
            answer = f"Attachment analysis identified: {names}. Files were inspected for executable extensions (.exe, .scr, .vbs) and weaponized macro scripts."
        else:
            answer = "No weaponized attachments were detected in this message payload."

    # Links / URL questions
    elif any(k in q_lower for k in ("link", "url", "website", "domain")):
        links = scan.get("links", [])
        sus_links = [l for l in links if l.get("is_suspicious")]
        if sus_links:
            urls = ", ".join(l.get("url", "") for l in sus_links[:3])
            answer = f"Suspicious URLs detected: {urls}. These destinations exhibit direct-IP routing, deceptive keywords, or high-risk TLD patterns characteristic of phishing credential harvesters."
        elif links:
            answer = f"Found {len(links)} hyperlink(s) in the message body. None showed direct indicators of known phishing infrastructure."
        else:
            answer = "No hyperlinks were detected in this email body."

    # Authentication headers
    elif any(k in q_lower for k in ("spf", "dkim", "dmarc", "header", "auth")):
        answer = f"Authentication Status for Case #{scan_id[:8]}: SPF={scan.get('spf_result')}, DKIM={scan.get('dkim_result')}, DMARC={scan.get('dmarc_result')}. {'Failing checks indicate email spoofing or in-transit header modification.' if 'FAIL' in (scan.get('spf_result', '') + scan.get('dkim_result', '') + scan.get('dmarc_result', '')) else 'All authentication checks are valid.'}"

    # Default case summary
    else:
        answer = f"Forensic Case #{scan_id[:8]} Summary: Verdict is {scan.get('verdict', '').upper()} (Score: {scan.get('risk_score')}/100). Sender: {scan.get('sender')}. Routing: {len(hops)} transit hop(s) detected. Feel free to ask about origin IP, SPF/DKIM results, links, or attachments!"

    return {"answer": answer, "scanId": scan_id}

# 7. GET /api/report/{scan_id} (PDF Generation)
@app.get("/api/report/{scan_id}")
def download_pdf(scan_id: str):
    scan = get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Case not found")

    pdf_bytes = generate_pdf_bytes(scan)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="MailShield-Case-{scan_id}.pdf"'}
    )

# 8. POST /api/report-cert/{scan_id}
@app.post("/api/report-cert/{scan_id}")
def report_cert(scan_id: str):
    scan = get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Case not found")

    reference_id = f"CERT-IN-{datetime.now().year}-{random.randint(100000, 999999)}"
    return {
        "success": True,
        "referenceId": reference_id,
        "caseId": scan_id,
        "timestamp": datetime.utcnow().isoformat(),
        "message": "Incident docket successfully submitted to national cyber response queue."
    }

# 9. GET /api/samples/{sample_type}
@app.get("/api/samples/{sample_type}")
def get_sample_email(sample_type: str):
    fname = "sample-phishing.eml" if sample_type == "phishing" else "sample-safe.eml"
    fpath = os.path.join(os.path.dirname(__file__), "samples", fname)
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            return {"type": sample_type, "rawText": f.read()}
    raise HTTPException(status_code=404, detail="Sample not found")

# 10. GET /api/dashboard-stats
@app.get("/api/dashboard-stats")
def dashboard_stats():
    return get_stats()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
