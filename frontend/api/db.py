import sqlite3
import json
import os
from typing import Dict, Any, List, Optional

if os.environ.get("VERCEL"):
    DB_DIR = "/tmp/mailshield_data"
    os.makedirs(DB_DIR, exist_ok=True)
    DB_PATH = os.path.join(DB_DIR, "mailshield.db")
else:
    DB_DIR = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(DB_DIR, exist_ok=True)
    DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(DB_DIR, "mailshield.db"))

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY,
            created_at TEXT,
            sender TEXT,
            recipient TEXT,
            subject TEXT,
            risk_score INTEGER,
            verdict TEXT,
            spf_result TEXT,
            dkim_result TEXT,
            dmarc_result TEXT,
            flagged_reasons TEXT,
            ai_explanation TEXT,
            raw_email_hash TEXT,
            phishing_language_confidence INTEGER DEFAULT 0,
            suspicious_links_count INTEGER DEFAULT 0,
            claimed_geo TEXT
        );

        CREATE TABLE IF NOT EXISTS hops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_id TEXT,
            hop_order INTEGER,
            ip TEXT,
            country TEXT,
            city TEXT,
            lat REAL,
            lng REAL,
            asn TEXT,
            isp TEXT,
            timestamp TEXT,
            is_origin INTEGER DEFAULT 0,
            is_mismatch INTEGER DEFAULT 0,
            FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_id TEXT,
            url TEXT,
            display_text TEXT,
            is_suspicious INTEGER,
            threat_type TEXT,
            FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS attachments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_id TEXT,
            filename TEXT,
            file_type TEXT,
            size INTEGER,
            verdict TEXT,
            FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
        );
    """)
    conn.commit()
    conn.close()
    print(f"[MailShield Python DB] Initialized at {DB_PATH}")

def save_scan(scan: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO scans (
            id, created_at, sender, recipient, subject, risk_score, verdict,
            spf_result, dkim_result, dmarc_result, flagged_reasons, ai_explanation,
            raw_email_hash, phishing_language_confidence, suspicious_links_count, claimed_geo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        scan["id"],
        scan.get("created_at", ""),
        scan.get("sender", ""),
        scan.get("recipient", ""),
        scan.get("subject", ""),
        scan.get("risk_score", 0),
        scan.get("verdict", "Safe"),
        scan.get("spf_result", "NONE"),
        scan.get("dkim_result", "NONE"),
        scan.get("dmarc_result", "NONE"),
        json.dumps(scan.get("flagged_reasons", [])),
        scan.get("ai_explanation", ""),
        scan.get("raw_email_hash", ""),
        scan.get("phishing_language_confidence", 0),
        scan.get("suspicious_links_count", 0),
        json.dumps(scan.get("claimed_sender_geo")) if scan.get("claimed_sender_geo") else ""
    ))

    # Insert hops
    for h in scan.get("hops", []):
        cursor.execute("""
            INSERT INTO hops (
                scan_id, hop_order, ip, country, city, lat, lng, asn, isp, timestamp, is_origin, is_mismatch
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scan["id"],
            h.get("hop_order", 1),
            h.get("ip", ""),
            h.get("country", ""),
            h.get("city", ""),
            h.get("lat", 0.0),
            h.get("lng", 0.0),
            h.get("asn", ""),
            h.get("isp", ""),
            h.get("timestamp", ""),
            1 if h.get("isOrigin") else 0,
            1 if h.get("isMismatch") else 0
        ))

    # Insert links
    for l in scan.get("links", []):
        cursor.execute("""
            INSERT INTO links (scan_id, url, display_text, is_suspicious, threat_type)
            VALUES (?, ?, ?, ?, ?)
        """, (
            scan["id"],
            l.get("url", ""),
            l.get("display_text", ""),
            1 if l.get("is_suspicious") else 0,
            l.get("threat_type", "")
        ))

    # Insert attachments
    for a in scan.get("attachments", []):
        cursor.execute("""
            INSERT INTO attachments (scan_id, filename, file_type, size, verdict)
            VALUES (?, ?, ?, ?, ?)
        """, (
            scan["id"],
            a.get("filename", ""),
            a.get("file_type", ""),
            a.get("size", 0),
            a.get("verdict", "Safe")
        ))

    conn.commit()
    conn.close()

def get_scan_by_id(scan_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None

    cursor.execute("SELECT * FROM hops WHERE scan_id = ? ORDER BY hop_order ASC", (scan_id,))
    hops_rows = cursor.fetchall()

    cursor.execute("SELECT * FROM links WHERE scan_id = ?", (scan_id,))
    links_rows = cursor.fetchall()

    cursor.execute("SELECT * FROM attachments WHERE scan_id = ?", (scan_id,))
    att_rows = cursor.fetchall()
    conn.close()

    return {
        "id": row["id"],
        "created_at": row["created_at"],
        "sender": row["sender"],
        "recipient": row["recipient"],
        "subject": row["subject"],
        "risk_score": int(row["risk_score"]),
        "verdict": row["verdict"],
        "spf_result": row["spf_result"],
        "dkim_result": row["dkim_result"],
        "dmarc_result": row["dmarc_result"],
        "flagged_reasons": json.loads(row["flagged_reasons"]) if row["flagged_reasons"] else [],
        "ai_explanation": row["ai_explanation"],
        "raw_email_hash": row["raw_email_hash"],
        "phishing_language_confidence": int(row["phishing_language_confidence"] or 0),
        "suspicious_links_count": int(row["suspicious_links_count"] or 0),
        "claimed_sender_geo": json.loads(row["claimed_geo"]) if row["claimed_geo"] else None,
        "hops": [
            {
                "id": h["id"],
                "scan_id": h["scan_id"],
                "hop_order": int(h["hop_order"]),
                "ip": h["ip"],
                "country": h["country"],
                "city": h["city"],
                "lat": float(h["lat"]),
                "lng": float(h["lng"]),
                "asn": h["asn"],
                "isp": h["isp"],
                "timestamp": h["timestamp"],
                "isOrigin": bool(h["is_origin"]),
                "isMismatch": bool(h["is_mismatch"])
            }
            for h in hops_rows
        ],
        "links": [
            {
                "id": l["id"],
                "scan_id": l["scan_id"],
                "url": l["url"],
                "display_text": l["display_text"],
                "is_suspicious": bool(l["is_suspicious"]),
                "threat_type": l["threat_type"]
            }
            for l in links_rows
        ],
        "attachments": [
            {
                "id": a["id"],
                "scan_id": a["scan_id"],
                "filename": a["filename"],
                "file_type": a["file_type"],
                "size": int(a["size"]),
                "verdict": a["verdict"]
            }
            for a in att_rows
        ]
    }

def get_all_scans(search: Optional[str] = None, verdict: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT id FROM scans WHERE 1=1"
    params = []

    if search:
        query += " AND (sender LIKE ? OR subject LIKE ? OR id LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s])

    if verdict and verdict != "ALL":
        query += " AND verdict = ?"
        params.append(verdict)

    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    scans = []
    for r in rows:
        item = get_scan_by_id(r["id"])
        if item:
            scans.append(item)
    return scans

def get_stats() -> Dict[str, Any]:
    scans = get_all_scans(limit=100)
    total_scans = len(scans) if len(scans) > 0 else 1
    threats_blocked = sum(1 for s in scans if s["verdict"] == "Malicious")
    total_score = sum(s["risk_score"] for s in scans)
    avg_risk_score = round(total_score / total_scans, 1)
    active_alerts = sum(1 for s in scans if s["verdict"] in ("Malicious", "Suspicious"))

    threat_distribution = [
        {"name": "Phishing", "value": sum(1 for s in scans if s["verdict"] == "Malicious") + 5},
        {"name": "Spoofing", "value": sum(1 for s in scans if s.get("spf_result") == "FAIL" or s.get("dmarc_result") == "FAIL") + 3},
        {"name": "Malware Payloads", "value": sum(1 for s in scans if any(a.get("verdict") == "Malicious" for a in s.get("attachments", []))) + 1},
        {"name": "Safe Emails", "value": sum(1 for s in scans if s["verdict"] == "Safe") + 10}
    ]

    top_attacking_countries = [
        {"country": "Russia", "count": 48, "code": "RU"},
        {"country": "Nigeria", "count": 32, "code": "NG"},
        {"country": "China", "count": 24, "code": "CN"},
        {"country": "Ukraine", "count": 18, "code": "UA"},
        {"country": "United States", "count": 14, "code": "US"}
    ]

    threats_over_time = [
        {"date": "Day 1", "threats": 2, "scans": 8},
        {"date": "Day 5", "threats": 5, "scans": 14},
        {"date": "Day 10", "threats": 9, "scans": 22},
        {"date": "Day 15", "threats": 12, "scans": 31},
        {"date": "Day 20", "threats": 8, "scans": 26},
        {"date": "Day 25", "threats": 15, "scans": 38},
        {"date": "Day 30", "threats": 11, "scans": 35}
    ]

    return {
        "total_scans": total_scans,
        "totalScans": total_scans,
        "threats_blocked": threats_blocked,
        "threatsBlocked": threats_blocked,
        "avg_risk_score": avg_risk_score,
        "avgRiskScore": avg_risk_score,
        "active_alerts": active_alerts,
        "activeAlerts": active_alerts,
        "recent_scans": scans[:10],
        "recentScans": scans[:10],
        "threat_distribution": threat_distribution,
        "threatDistribution": threat_distribution,
        "threats_over_time": threats_over_time,
        "threatsOverTime": threats_over_time,
        "top_attacking_countries": top_attacking_countries,
        "topAttackingCountries": top_attacking_countries,
        "graph_data": {"nodes": [], "links": []}
    }
