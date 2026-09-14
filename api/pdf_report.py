import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_bytes(scan: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#1E3A8A'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#4B5563'),
        spaceAfter=12
    )
    section_title = ParagraphStyle(
        'SecTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#111827'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#374151')
    )

    story = []

    # 1. Header Banner
    story.append(Paragraph("MAILSHIELD AI · FORENSIC CASE REPORT", title_style))
    story.append(Paragraph(
        f"Case ID: {scan['id']} &nbsp;&nbsp;|&nbsp;&nbsp; Classification: CERT-In Incident Standard &nbsp;&nbsp;|&nbsp;&nbsp; Date: {scan.get('created_at', '')}",
        subtitle_style
    ))

    # 2. Threat Score & Verdict
    verdict = scan.get("verdict", "Safe").upper()
    score = scan.get("risk_score", 0)
    bg_color = colors.HexColor('#FEF2F2') if score >= 70 else (colors.HexColor('#FFFBEB') if score >= 30 else colors.HexColor('#ECFDF5'))
    border_color = colors.HexColor('#DC2626') if score >= 70 else (colors.HexColor('#D97706') if score >= 30 else colors.HexColor('#059669'))

    verdict_text = f"<b>VERDICT: {verdict} (THREAT SCORE: {score}/100)</b><br/>SPF: {scan.get('spf_result')} &nbsp;|&nbsp; DKIM: {scan.get('dkim_result')} &nbsp;|&nbsp; DMARC: {scan.get('dmarc_result')} &nbsp;|&nbsp; Threat Vectors: {len(scan.get('flagged_reasons', []))}"
    verdict_table = Table([[Paragraph(verdict_text, body_style)]], colWidths=[540])
    verdict_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_color),
        ('BOX', (0, 0), (-1, -1), 1.5, border_color),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(verdict_table)
    story.append(Spacer(1, 10))

    # 3. Message Metadata
    story.append(Paragraph("1. Message & Identity Metadata", section_title))
    meta_data = [
        ["Subject:", scan.get("subject", "")],
        ["From:", scan.get("sender", "")],
        ["To:", scan.get("recipient", "Internal Recipient")],
    ]
    if scan.get("claimed_sender_geo"):
        geo = scan["claimed_sender_geo"]
        meta_data.append(["Claimed Geo:", f"{geo.get('city')}, {geo.get('country')}"])

    meta_table = Table(meta_data, colWidths=[80, 460])
    meta_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#374151')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 4. Chain of Custody Hash
    story.append(Paragraph("2. Chain-of-Custody Cryptographic Hash", section_title))
    hash_data = [[f"SHA-256: {scan.get('raw_email_hash', '')}"]]
    hash_table = Table(hash_data, colWidths=[540])
    hash_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F3F4F6')),
        ('FONTNAME', (0, 0), (-1, -1), 'Courier'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(hash_table)
    story.append(Spacer(1, 10))

    # 5. MTA Intermediate Hops Table
    story.append(Paragraph("3. Intermediate Mail Transfer Agent (MTA) Route", section_title))
    hop_rows = [["Hop", "IP Address", "Geolocation", "Autonomous System (ASN)", "Status"]]
    for h in scan.get("hops", []):
        hop_rows.append([
            f"#{h.get('hop_order')}",
            h.get("ip", ""),
            f"{h.get('city', '')}, {h.get('country', '')}",
            (h.get("asn") or "N/A")[:26],
            "GEO MISMATCH" if h.get("isMismatch") else "Verified Relay"
        ])

    hop_table = Table(hop_rows, colWidths=[35, 95, 140, 170, 100])
    hop_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E5E7EB')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#D1D5DB')),
    ]))
    story.append(hop_table)
    story.append(Spacer(1, 10))

    # 6. AI Assessment
    story.append(Paragraph("4. AI Forensic Expert Assessment", section_title))
    ai_box = [[Paragraph(scan.get("ai_explanation", ""), body_style)]]
    ai_table = Table(ai_box, colWidths=[540])
    ai_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F9FAFB')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(ai_table)
    story.append(Spacer(1, 15))

    # Footer
    story.append(Paragraph(
        "<i>Generated by MailShield AI — Forensic Intelligence & GeoLocation Platform. Certified for CERT-In incident filing.</i>",
        subtitle_style
    ))

    doc.build(story)
    return buffer.getvalue()
