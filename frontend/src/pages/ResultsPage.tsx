import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Download,
  Share2,
  MapPin,
  Link2,
  Paperclip,
  BrainCircuit,
  Terminal,
  Send,
  ArrowLeft,
  Copy,
  CheckCircle2,
  ExternalLink,
  Lock,
  Globe,
  Loader2
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RiskGauge } from '../components/ui/RiskGauge';
import { PageTransition } from '../components/ui/PageTransition';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { GeoHopMap } from '../components/results/GeoHopMap';
import { api } from '../services/api';
import { ScanResult } from '@shared/types';

export const ResultsPage: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();

  const [scanData, setScanData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Typewriter streaming effect for AI Copilot explanation
  const [displayedExplanation, setDisplayedExplanation] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // CERT-In incident reporting modal state
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [certReference, setCertReference] = useState<string | null>(null);
  const [isReportingCert, setIsReportingCert] = useState<boolean>(false);

  // Copilot interactive question state
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotHistory, setCopilotHistory] = useState<{ q: string; a: string }[]>([]);
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  useEffect(() => {
    if (!scanId) return;

    const fetchScan = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getScan(scanId);
        setScanData(data);
        startTypewriter(data.ai_explanation);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load forensic case file.');
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [scanId]);

  // Typewriter effect generator
  const startTypewriter = (text: string) => {
    if (!text) return;
    setDisplayedExplanation('');
    setIsTyping(true);

    const words = text.split(' ');
    let currentIdx = 0;
    let builtText = '';

    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        builtText += (currentIdx > 0 ? ' ' : '') + words[currentIdx];
        setDisplayedExplanation(builtText);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 45);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleReportCert = async () => {
    if (!scanId) return;
    setIsReportingCert(true);
    try {
      const res = await api.reportToCert(scanId);
      setCertReference(res.referenceId);
      setCertModalOpen(true);
    } catch (e: any) {
      alert('Mock CERT-In dispatch failed. Please retry.');
    } finally {
      setIsReportingCert(false);
    }
  };

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || !scanId || isCopilotThinking) return;

    const query = copilotQuery.trim();
    setCopilotQuery('');
    setIsCopilotThinking(true);

    try {
      const res = await api.askCopilot(scanId, query);
      setCopilotHistory((prev) => [...prev, { q: query, a: res.answer }]);
    } catch (e: any) {
      setCopilotHistory((prev) => [
        ...prev,
        { q: query, a: 'Unable to reach AI copilot engine. Check API keys in backend configuration.' }
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-heading font-semibold text-text-muted">
          De-serializing forensic case file #{scanId?.slice(0, 8)}...
        </p>
      </div>
    );
  }

  if (error || !scanData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-danger" />
        <h2 className="text-2xl font-heading font-bold text-text-primary">Scan Not Found</h2>
        <p className="text-sm text-text-muted max-w-md">{error || 'The requested forensic report does not exist.'}</p>
        <Link to="/scan">
          <Button variant="primary" size="md">
            Scan an Email
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <PageTransition className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/scan"
            className="p-2 rounded-xl bg-surface border border-border/80 hover:bg-surface-glass text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary font-bold">CASE FILE #{scanData.id.slice(0, 8)}</span>
              <span className="text-xs text-text-muted">· {new Date(scanData.created_at).toLocaleString()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary truncate max-w-xl">
              {scanData.subject || '(No Subject)'}
            </h1>
          </div>
        </div>

        {/* Action Buttons: PDF, CERT-In, New Scan */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={api.getReportDownloadUrl(scanData.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button size="sm" variant="primary" icon={<Download size={14} />}>
              Forensic Report (PDF)
            </Button>
          </a>

          <Button
            size="sm"
            variant="danger"
            onClick={handleReportCert}
            isLoading={isReportingCert}
            icon={<ShieldAlert size={14} />}
          >
            Report to CERT-In
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/scan')}
          >
            Scan Another
          </Button>
        </div>
      </div>

      {/* 1. TOP SECTION: Large RiskGauge + Verdict + One-line AI Summary */}
      <ScrollReveal>
        <GlassCard
          glow={
            scanData.risk_score >= 70
              ? 'red'
              : scanData.risk_score >= 30
              ? 'amber'
              : 'green'
          }
          className="p-8 sm:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Risk Gauge */}
            <div className="flex justify-center md:justify-start">
              <RiskGauge score={scanData.risk_score} size={200} strokeWidth={16} />
            </div>

            {/* Verdict & Meta Details */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge status={scanData.verdict} size="lg" />
                <span className="text-xs font-mono text-text-muted">
                  SHA-256 Hash: <code className="text-text-primary">{scanData.raw_email_hash?.slice(0, 16)}...</code>
                </span>
                <button
                  onClick={() => handleCopyHash(scanData.raw_email_hash)}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  title="Copy Full Evidence Hash"
                >
                  {copiedHash ? <CheckCircle2 size={14} className="text-accent" /> : <Copy size={14} />}
                </button>
              </div>

              <h2 className="text-2xl font-heading font-extrabold text-text-primary">
                {scanData.verdict === 'Malicious'
                  ? 'Critical Email Threat Identified'
                  : scanData.verdict === 'Suspicious'
                  ? 'Suspicious Activity Detected'
                  : 'Email Authenticity Verified'}
              </h2>

              <p className="text-sm text-text-muted leading-relaxed">
                <strong>Sender Claim:</strong> <code>{scanData.sender}</code>
                <br />
                <strong>Claimed Origin:</strong>{' '}
                {scanData.claimed_sender_geo
                  ? `${scanData.claimed_sender_geo.city}, ${scanData.claimed_sender_geo.country}`
                  : 'Undisclosed DNS Origin'}
              </p>

              {/* Flagged reasons pills */}
              {scanData.flagged_reasons && scanData.flagged_reasons.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono text-text-muted uppercase">Detected Threat Vectors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {scanData.flagged_reasons.map((r, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-danger/10 text-danger border border-danger/20 font-medium"
                      >
                        ⚠️ {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 2. GRID OF 4 FINDING CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Auth Checks */}
        <ScrollReveal delay={0.1}>
          <GlassCard glow="blue" className="h-full space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">Cryptographic Auth</span>
              <Lock size={16} className="text-primary" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">SPF Protocol:</span>
                <span className={`font-mono font-bold ${scanData.spf_result === 'PASS' ? 'text-accent' : 'text-danger'}`}>
                  {scanData.spf_result}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">DKIM Signature:</span>
                <span className={`font-mono font-bold ${scanData.dkim_result === 'PASS' ? 'text-accent' : 'text-danger'}`}>
                  {scanData.dkim_result}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">DMARC Policy:</span>
                <span className={`font-mono font-bold ${scanData.dmarc_result === 'PASS' ? 'text-accent' : 'text-danger'}`}>
                  {scanData.dmarc_result}
                </span>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Card 2: Links Count */}
        <ScrollReveal delay={0.15}>
          <GlassCard glow={scanData.suspicious_links_count > 0 ? 'red' : 'green'} className="h-full space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">URL Threat Scan</span>
              <Link2 size={16} className="text-accent" />
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-heading font-extrabold text-text-primary">
                {scanData.links?.length || 0}
                <span className="text-xs font-normal text-text-muted ml-1">URLs Parsed</span>
              </div>
              <p className={`text-xs font-semibold ${scanData.suspicious_links_count > 0 ? 'text-danger' : 'text-accent'}`}>
                {scanData.suspicious_links_count > 0
                  ? `🚨 ${scanData.suspicious_links_count} suspicious or IP-based links`
                  : '✓ 0 suspicious domains identified'}
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Card 3: Attachments */}
        <ScrollReveal delay={0.2}>
          <GlassCard glow="blue" className="h-full space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">Attachment Sandbox</span>
              <Paperclip size={16} className="text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-heading font-extrabold text-text-primary">
                {scanData.attachments?.length || 0}
                <span className="text-xs font-normal text-text-muted ml-1">Payloads</span>
              </div>
              <p className="text-xs text-text-muted">
                {scanData.attachments && scanData.attachments.length > 0
                  ? scanData.attachments.map((a) => `${a.filename} (${a.verdict})`).join(', ')
                  : '✓ No risky file payloads attached'}
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Card 4: NLP Phishing Confidence */}
        <ScrollReveal delay={0.25}>
          <GlassCard glow="blue" className="h-full space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">AI Phishing NLP</span>
              <BrainCircuit size={16} className="text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-heading font-extrabold text-text-primary">
                {scanData.phishing_language_confidence}%
              </div>
              <p className="text-xs text-text-muted">
                Urgency index & coercive language score
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>

      {/* 3. WORLD MAP & GEOLOCATION HOP TRAJECTORY */}
      <ScrollReveal>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                <span>Geographic Email Relay Path & Mismatch Detection</span>
              </h2>
              <p className="text-xs text-text-muted">
                Traced physical autonomous system path across intermediate Mail Transfer Agents (MTAs).
              </p>
            </div>
            <Badge status="Info" size="sm">
              {scanData.hops?.length || 0} NETWORK HOPS
            </Badge>
          </div>

          <GeoHopMap
            hops={scanData.hops || []}
            claimedSenderGeo={scanData.claimed_sender_geo}
          />
        </div>
      </ScrollReveal>

      {/* 4. VERTICAL TIMELINE / HOP STEPPER */}
      <ScrollReveal>
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <h3 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
              <MapPin size={18} className="text-accent" />
              <span>Full Hop Forensic Ledger</span>
            </h3>
            <span className="text-xs font-mono text-text-muted">Chronological Transit Trace</span>
          </div>

          <div className="space-y-4">
            {scanData.hops && scanData.hops.length > 0 ? (
              scanData.hops.map((hop, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    hop.isMismatch
                      ? 'bg-danger/10 border-danger/40 shadow-glow-danger'
                      : 'bg-surface/60 border-border/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        hop.isMismatch ? 'bg-danger text-white' : 'bg-primary/20 text-primary border border-primary/40'
                      }`}
                    >
                      {hop.hop_order}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-text-primary">
                          {hop.city || 'Unknown City'}, {hop.country || 'International'}
                        </span>
                        {hop.isMismatch && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger text-white">
                            SPOOF ORIGIN MISMATCH
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-text-muted">
                        IP: <code className="text-primary font-semibold">{hop.ip}</code> · ASN: {hop.asn || 'N/A'} · ISP: {hop.isp || 'Autonomous System'}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-text-muted sm:text-right font-mono">
                    <span>{hop.timestamp || 'MTA Timestamp Verified'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted">No MTA relay headers found in message.</p>
            )}
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 5. AI COPILOT EXPLAINABILITY PANEL */}
      <ScrollReveal>
        <GlassCard glow="blue" className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center shadow-glow-primary">
                <BrainCircuit size={18} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-text-primary">
                  AI Forensic Copilot Intelligence
                </h3>
                <span className="text-xs text-text-muted font-mono">Autonomous Plain-English Explanation</span>
              </div>
            </div>
            {isTyping && (
              <span className="text-xs font-mono text-primary flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary" /> Streaming Findings...
              </span>
            )}
          </div>

          {/* Typewriter text bubble */}
          <div className="p-5 rounded-xl bg-surface/80 border border-border/80 text-sm leading-relaxed text-text-primary relative font-sans">
            <p className="whitespace-pre-line">
              {displayedExplanation || scanData.ai_explanation}
            </p>
          </div>

          {/* Interactive follow-up Q&A */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            <h4 className="text-xs font-mono text-text-muted uppercase">
              Ask Forensic Follow-Up Questions About This Case:
            </h4>

            {copilotHistory.map((item, i) => (
              <div key={i} className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-primary/10 text-primary font-medium">
                  <strong>You:</strong> {item.q}
                </div>
                <div className="p-3 rounded-lg bg-surface border border-border text-text-muted leading-relaxed">
                  <strong>Copilot:</strong> {item.a}
                </div>
              </div>
            ))}

            <form onSubmit={handleAskCopilot} className="flex gap-2">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask e.g.: Is this IP associated with a known botnet? Or what makes this link dangerous?"
                className="flex-1 rounded-xl bg-surface border border-border px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
              />
              <Button size="sm" variant="primary" type="submit" isLoading={isCopilotThinking} icon={<Send size={14} />}>
                Ask
              </Button>
            </form>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* CERT-In Confirmation Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 rounded-2xl bg-surface border border-primary/40 shadow-2xl space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-accent/20 text-accent border border-accent/40 flex items-center justify-center mx-auto shadow-glow-accent">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-primary">
              Dispatched to CERT-In
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              The incident docket with SHA-256 evidence chain of custody has been transmitted to the national cybersecurity triage dispatch queue.
            </p>
            <div className="p-3 rounded-xl bg-surface/80 border border-border font-mono text-xs text-primary font-bold">
              Dispatch Ref: {certReference}
            </div>
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              onClick={() => setCertModalOpen(false)}
            >
              Acknowledge & Close
            </Button>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
};
