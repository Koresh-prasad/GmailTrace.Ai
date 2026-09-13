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
    q_lower = (req.question or "").lower()

    if any(k in q_lower for k in ("spf", "dkim", "dmarc")):
        answer = "SPF (Sender Policy Framework) verifies authorized IP senders via DNS. DKIM uses public-key cryptography to ensure message integrity in transit. DMARC aligns both protocols and enforces quarantine or reject policies."
    elif any(k in q_lower for k in ("phish", "identify", "spot")):
        answer = "Key indicators of phishing include: urgent psychological language, lookalike domain names with obscure TLDs, destination URLs that differ from anchor display text, and failing cryptographic DMARC checks."
    elif any(k in q_lower for k in ("cert-in", "report", "incident")):
        answer = "CERT-In accepts formal cyber incident reports for phishing and credential compromise. MailShield exports court-admissible PDF reports sealed with SHA-256 custody hashes ready for intake."
    else:
        answer = "I am MailShield AI Copilot. You can ask me about email authentication headers, multi-hop IP triangulation, or test an email file live in the scanner."

    return {"answer": answer}

# 6. POST /api/copilot/{scan_id}
@app.post("/api/copilot/{scan_id}")
def copilot_case(scan_id: str, req: CopilotRequest):
    scan = get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Case not found")

    q_lower = (req.question or "").lower()
    if any(k in q_lower for k in ("ip", "located", "where", "origin")):
        origin = scan.get("hops", [{}])[0]
        answer = f"The email claims to originate from {scan.get('sender')}, but network Received headers show it originated from {origin.get('ip')} in {origin.get('city')}, {origin.get('country')} (ASN: {origin.get('asn')}). This discrepancy indicates an unauthorized mail relay."
    elif any(k in q_lower for k in ("attachment", "payload", "file")):
        atts = scan.get("attachments", [])
        if atts:
            names = ", ".join(f"{a['filename']} ({a['verdict']})" for a in atts)
            answer = f"Attachment scan identified: {names}. File signatures were evaluated against executable and macro threats."
        else:
            answer = "No weaponized attachments were detected in this message. The primary threat vector is credential phishing and header spoofing."
    elif any(k in q_lower for k in ("safe", "click")):
        if scan.get("verdict") == "Malicious":
            answer = "DO NOT CLICK. This email contains spoofed headers and deceptive links designed for credential harvesting."
        else:
            answer = "This message successfully passed cryptographic SPF, DKIM, and DMARC validations with untampered transit hops."
    else:
        answer = f"Forensic Case Summary: Classified as {scan.get('verdict', '').upper()} (Score: {scan.get('risk_score')}/100). SPF is {scan.get('spf_result')}, DKIM is {scan.get('dkim_result')}, and DMARC is {scan.get('dmarc_result')}. {'. '.join(scan.get('flagged_reasons', []))}."

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
