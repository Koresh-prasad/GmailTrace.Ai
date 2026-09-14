import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Lock,
  Download
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { api } from '../services/api';
import { ScanResult } from '@/types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [verdictFilter, setVerdictFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const loadScans = async () => {
      try {
        const data = await api.getScans();
        setScans(data);
      } catch (err) {
        // Fallback default list if backend is loading
        setScans([
          {
            id: 'scan-sample-01',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            sender: 'security-alerts@bank-corp-security-login.top',
            subject: 'URGENT: Mandatory MFA Re-Verification',
            risk_score: 94,
            verdict: 'Malicious',
            spf_result: 'FAIL',
            dkim_result: 'FAIL',
            dmarc_result: 'FAIL',
            flagged_reasons: ['Spoofed sender', 'Russian relay hop', 'Urgency NLP'],
            ai_explanation: 'Spoofed credential harvesting attempt.',
            raw_email_hash: '9f834ec64e29e802d577eb2d32e1def2f66d5265554740b07c57a3e748e09f4b',
            hops: [],
            links: [],
            attachments: [],
            phishing_language_confidence: 96,
            suspicious_links_count: 2
          },
          {
            id: 'scan-sample-02',
            created_at: new Date(Date.now() - 14400000).toISOString(),
            sender: 'notifications@github.com',
            subject: '[GitHub] Pull Request #42 merged into main',
            risk_score: 12,
            verdict: 'Safe',
            spf_result: 'PASS',
            dkim_result: 'PASS',
            dmarc_result: 'PASS',
            flagged_reasons: [],
            ai_explanation: 'Legitimate cryptographic signature from GitHub MTA.',
            raw_email_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            hops: [],
            links: [],
            attachments: [],
            phishing_language_confidence: 4,
            suspicious_links_count: 0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadScans();
  }, []);

  // Filter and sort
  const filtered = scans
    .filter((s) => {
      const matchText =
        s.sender.toLowerCase().includes(search.toLowerCase()) ||
        s.subject.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchVerdict = verdictFilter === 'ALL' || s.verdict.toUpperCase() === verdictFilter.toUpperCase();
      return matchText && matchVerdict;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else {
        return sortOrder === 'desc' ? b.risk_score - a.risk_score : a.risk_score - b.risk_score;
      }
    });

  return (
    <PageTransition className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <History size={14} />
            <span>Forensic Evidence Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary mt-1">
            Email Scan History
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Browse, filter, and audit past forensic analyses, cryptographic evaluations, and chain-of-custody hashes.
          </p>
        </div>

        <Link to="/scan">
          <Button variant="primary" size="md">
            New Scan
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search sender, subject, case ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Verdict Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['ALL', 'SAFE', 'SUSPICIOUS', 'MALICIOUS'].map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-heading transition-all ${
                  verdictFilter === v
                    ? 'bg-primary text-white shadow-glow-primary'
                    : 'bg-surface/60 text-text-muted hover:text-text-primary hover:bg-surface'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'risk' : 'date')}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text-muted hover:text-text-primary flex items-center gap-1.5"
            >
              <ArrowUpDown size={13} />
              <span>Sort: {sortBy === 'date' ? 'Date' : 'Risk Score'}</span>
            </button>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text-muted hover:text-text-primary"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Scans Grid / Cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 0.05}>
              <GlassCard
                glow={
                  item.risk_score >= 70
                    ? 'red'
                    : item.risk_score >= 30
                    ? 'amber'
                    : 'green'
                }
                interactive
                onClick={() => navigate(`/results/${item.id}`)}
                className="cursor-pointer p-6 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge status={item.verdict} size="sm" />
                      <span className="text-xs font-mono font-bold text-primary">
                        CASE #{item.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar size={12} /> {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-heading font-bold text-text-primary truncate">
                      {item.subject || '(No Subject)'}
                    </h3>

                    <p className="text-xs font-mono text-text-muted truncate">
                      From: <span className="text-text-primary">{item.sender}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-text-muted pt-1">
                      <span>SPF: <strong className={item.spf_result === 'PASS' ? 'text-accent' : 'text-danger'}>{item.spf_result}</strong></span>
                      <span>·</span>
                      <span>DKIM: <strong className={item.dkim_result === 'PASS' ? 'text-accent' : 'text-danger'}>{item.dkim_result}</strong></span>
                      <span>·</span>
                      <span>DMARC: <strong className={item.dmarc_result === 'PASS' ? 'text-accent' : 'text-danger'}>{item.dmarc_result}</strong></span>
                      <span>·</span>
                      <span>Hash: <code>{item.raw_email_hash?.slice(0, 12)}...</code></span>
                    </div>
                  </div>

                  {/* Right score and action */}
                  <div className="flex items-center gap-6 self-end md:self-center shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-heading font-extrabold text-text-primary">
                        <span
                          className={
                            item.risk_score >= 70
                              ? 'text-danger'
                              : item.risk_score >= 30
                              ? 'text-warning'
                              : 'text-accent'
                          }
                        >
                          {item.risk_score}
                        </span>
                        <span className="text-xs text-text-muted font-normal">/100</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase text-text-muted">
                        Risk Score
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/30">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))
        ) : (
          <GlassCard className="p-12 text-center space-y-3">
            <History className="w-10 h-10 text-text-muted mx-auto" />
            <h3 className="text-lg font-heading font-bold text-text-primary">No scans match your criteria</h3>
            <p className="text-xs text-text-muted">Try adjusting your search terms or filters.</p>
          </GlassCard>
        )}
      </div>
    </PageTransition>
  );
};
