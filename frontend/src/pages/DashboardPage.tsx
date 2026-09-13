import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertOctagon,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Globe2,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { CampaignGraph } from '../components/dashboard/CampaignGraph';
import { api } from '../services/api';
import { DashboardStats, ScanResult } from '@shared/types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [verdictFilter, setVerdictFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        // Fallback default mock telemetry data for offline showcase
        setStats({
          total_scans: 1428,
          threats_blocked: 412,
          avg_risk_score: 58.4,
          active_alerts: 9,
          recent_scans: [
            {
              id: 'scan-demo-1',
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
              id: 'scan-demo-2',
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
            },
            {
              id: 'scan-demo-3',
              created_at: new Date(Date.now() - 28800000).toISOString(),
              sender: 'billing@cloud-renewal-invoice.co',
              subject: 'Invoice #83921 Overdue Notice',
              risk_score: 68,
              verdict: 'Suspicious',
              spf_result: 'FAIL',
              dkim_result: 'NONE',
              dmarc_result: 'FAIL',
              flagged_reasons: ['Domain age < 7 days', 'Missing DKIM'],
              ai_explanation: 'Suspicious newly registered lookalike domain.',
              raw_email_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
              hops: [],
              links: [],
              attachments: [],
              phishing_language_confidence: 72,
              suspicious_links_count: 1
            }
          ],
          threat_distribution: [
            { name: 'Phishing', value: 52 },
            { name: 'Spoofing', value: 24 },
            { name: 'Malware Payloads', value: 14 },
            { name: 'Safe Emails', value: 110 }
          ],
          threats_over_time: [
            { date: 'Day 1', threats: 12, scans: 45 },
            { date: 'Day 5', threats: 19, scans: 60 },
            { date: 'Day 10', threats: 25, scans: 72 },
            { date: 'Day 15', threats: 32, scans: 88 },
            { date: 'Day 20', threats: 28, scans: 80 },
            { date: 'Day 25', threats: 41, scans: 104 },
            { date: 'Day 30', threats: 36, scans: 95 }
          ],
          top_attacking_countries: [
            { country: 'Russia', count: 184, code: 'RU' },
            { country: 'Nigeria', count: 98, code: 'NG' },
            { country: 'China', count: 82, code: 'CN' },
            { country: 'Iran', count: 48, code: 'IR' },
            { country: 'Brazil', count: 32, code: 'BR' }
          ],
          graph_data: { nodes: [], links: [] }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  // Filter scans
  const filteredScans = stats?.recent_scans?.filter((s) => {
    const matchesSearch =
      s.sender.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.id.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesVerdict = verdictFilter === 'ALL' || s.verdict.toUpperCase() === verdictFilter.toUpperCase();
    return matchesSearch && matchesVerdict;
  });

  return (
    <PageTransition className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <Activity size={14} />
            <span>CERT-In Cyber Intelligence Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary mt-1">
            Global Threat Telemetry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Aggregated email threat distribution, intermediate hop transit trends, and coordinated campaign links.
          </p>
        </div>

        <Link to="/scan">
          <Button variant="primary" size="md" icon={<ArrowUpRight size={16} />} iconPosition="right">
            Execute Live Scan
          </Button>
        </Link>
      </div>

      {/* 1. TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScrollReveal delay={0.05}>
          <GlassCard glow="blue" className="p-5 space-y-2">
            <span className="text-xs font-mono text-text-muted uppercase">Total Scans Executed</span>
            <div className="text-3xl font-heading font-extrabold text-text-primary">
              {stats?.total_scans.toLocaleString() || '1,428'}
            </div>
            <p className="text-[11px] text-accent flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> +14.2% from past 7 days
            </p>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <GlassCard glow="red" className="p-5 space-y-2">
            <span className="text-xs font-mono text-text-muted uppercase">Threats Neutralized</span>
            <div className="text-3xl font-heading font-extrabold text-danger">
              {stats?.threats_blocked.toLocaleString() || '412'}
            </div>
            <p className="text-[11px] text-danger flex items-center gap-1 font-medium">
              <ShieldAlert size={12} /> 28.8% threat mitigation rate
            </p>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <GlassCard glow="amber" className="p-5 space-y-2">
            <span className="text-xs font-mono text-text-muted uppercase">Mean Risk Index</span>
            <div className="text-3xl font-heading font-extrabold text-warning">
              {stats?.avg_risk_score || '58.4'}
              <span className="text-xs text-text-muted font-normal">/100</span>
            </div>
            <p className="text-[11px] text-text-muted font-medium">
              Normalized multi-vector score
            </p>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <GlassCard glow="red" className="p-5 space-y-2">
            <span className="text-xs font-mono text-text-muted uppercase">Active Campaign Alerts</span>
            <div className="text-3xl font-heading font-extrabold text-danger">
              {stats?.active_alerts || '9'}
            </div>
            <p className="text-[11px] text-danger flex items-center gap-1 font-medium animate-pulse">
              <AlertOctagon size={12} /> Ongoing credential harvesting
            </p>
          </GlassCard>
        </ScrollReveal>
      </div>

      {/* 2. CHARTS GRID (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Threats over time */}
        <ScrollReveal delay={0.1} className="lg:col-span-2">
          <GlassCard className="p-6 space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary">
                  Threat Activity (Last 30 Days)
                </h3>
                <p className="text-xs text-text-muted">Daily incoming malicious messages vs total traffic</p>
              </div>
              <Badge status="Info" size="sm">TELEMETRY</Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.threats_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131826',
                      borderColor: '#1F2937',
                      borderRadius: '0.75rem',
                      color: '#E5E7EB',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="threats"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#EF4444' }}
                    name="Threats Detected"
                  />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Total Scans"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Pie Chart: Threat Type Distribution */}
        <ScrollReveal delay={0.15}>
          <GlassCard className="p-6 space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary">
                  Threat Classification
                </h3>
                <p className="text-xs text-text-muted">Breakdown by vector category</p>
              </div>
              <PieIcon size={16} className="text-primary" />
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.threat_distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {stats?.threat_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131826',
                      borderColor: '#1F2937',
                      borderRadius: '0.75rem',
                      color: '#E5E7EB',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              {stats?.threat_distribution.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-text-muted truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>

      {/* 3. BAR CHART: Top Attacking Countries + Force Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <ScrollReveal delay={0.1}>
          <GlassCard className="p-6 space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary flex items-center gap-2">
                  <Globe2 size={18} className="text-accent" />
                  <span>Top Attacking Origin Countries</span>
                </h3>
                <p className="text-xs text-text-muted">Detected primary origin Autonomous Systems</p>
              </div>
              <Badge status="Safe" size="sm">AS TRIANGULATION</Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.top_attacking_countries} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={11} />
                  <YAxis dataKey="country" type="category" stroke="#9CA3AF" fontSize={11} width={75} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131826',
                      borderColor: '#1F2937',
                      borderRadius: '0.75rem',
                      color: '#E5E7EB',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} name="Identified Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Force-directed Campaign Link Graph */}
        <ScrollReveal delay={0.15}>
          <div className="space-y-2 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary flex items-center gap-2">
                  <Layers size={18} className="text-primary" />
                  <span>Linked Campaign Intelligence Graph</span>
                </h3>
                <p className="text-xs text-text-muted">Visualizing relations across botnet IPs, domains, and phishing lures</p>
              </div>
              <Badge status="Suspicious" size="sm">FORCE GRAPH</Badge>
            </div>
            <div className="flex-1">
              <CampaignGraph />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* 4. RECENT SCANS TABLE */}
      <ScrollReveal>
        <GlassCard className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-text-primary">
                Recent Email Ingestion Ledger
              </h3>
              <p className="text-xs text-text-muted">Click any case row to inspect full forensic headers and route map</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Filter by sender, subject..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
                />
              </div>

              <select
                value={verdictFilter}
                onChange={(e) => setVerdictFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="ALL">All Verdicts</option>
                <option value="SAFE">Safe Only</option>
                <option value="SUSPICIOUS">Suspicious Only</option>
                <option value="MALICIOUS">Malicious Only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 text-text-muted font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3">Verdict</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Claimed Sender</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Auth (SPF/DKIM)</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {filteredScans && filteredScans.length > 0 ? (
                  filteredScans.map((scan) => (
                    <tr
                      key={scan.id}
                      onClick={() => navigate(`/results/${scan.id}`)}
                      className="hover:bg-surface/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <Badge status={scan.verdict} size="sm" />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span
                          className={
                            scan.risk_score >= 70
                              ? 'text-danger'
                              : scan.risk_score >= 30
                              ? 'text-warning'
                              : 'text-accent'
                          }
                        >
                          {scan.risk_score}
                        </span>
                        <span className="text-text-muted text-[10px]">/100</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-text-primary truncate max-w-[200px]" title={scan.sender}>
                        {scan.sender}
                      </td>
                      <td className="py-3 px-3 text-text-primary font-medium truncate max-w-[240px]" title={scan.subject}>
                        {scan.subject || '(No Subject)'}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className={scan.spf_result === 'PASS' ? 'text-accent' : 'text-danger'}>
                          {scan.spf_result}
                        </span>
                        <span className="text-text-muted"> / </span>
                        <span className={scan.dkim_result === 'PASS' ? 'text-accent' : 'text-danger'}>
                          {scan.dkim_result}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-text-muted whitespace-nowrap font-mono text-[11px]">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-primary font-medium inline-flex items-center gap-1 group-hover:underline">
                          Inspect <ArrowUpRight size={12} />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-text-muted">
                      No matching forensic logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </ScrollReveal>
    </PageTransition>
  );
};
