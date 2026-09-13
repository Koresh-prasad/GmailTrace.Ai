import React from 'react';
import {
  Shield,
  Code2,
  Cpu,
  Lock,
  Layers,
  Award,
  Users,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Github,
  Download
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const AboutPage: React.FC = () => {
  const techStack = [
    { name: 'React 18 + Vite', category: 'Frontend Core', desc: 'Ultra-fast HMR and optimized production bundling' },
    { name: 'TypeScript', category: 'Type Safety', desc: 'End-to-end contract typing across monorepo' },
    { name: 'Tailwind CSS', category: 'Design System', desc: 'Custom cyber dark tokenized theme with glassmorphism' },
    { name: 'Framer Motion', category: 'Animations', desc: 'Hardware-accelerated micro-interactions and route transitions' },
    { name: 'React-Leaflet', category: 'Geo Routing', desc: 'Interactive global multi-hop MTA trajectory visualization' },
    { name: 'Recharts', category: 'Analytics', desc: 'Forensic threat metrics, distribution and temporal graphs' },
    { name: 'Python FastAPI & Uvicorn', category: 'Backend Engine', desc: 'High-performance asynchronous MIME parser, RFC-5322 analyzer, and scoring engine' },
    { name: 'Node.js & Express', category: 'Dual Engine Support', desc: 'High-throughput alternate microservice backend' },
    { name: 'SQLite Engine', category: 'Database', desc: 'Zero-latency local forensic evidence ledger' },
    { name: 'ReportLab & PDFKit', category: 'Forensic PDF Engine', desc: 'Tamper-evident legal court-admissible audit reports with SHA-256 custody seals' },
    { name: 'AI Copilot / LLM', category: 'Forensic NLP', desc: 'Explainability engine translating telemetry to plain English' }
  ];

  const teamMembers = [
    {
      name: 'Subham Pradhan',
      role: 'Lead Full-Stack Architect & Cyber Forensics Lead',
      bio: 'Architected end-to-end RFC-5322 header parsing engine, multi-hop IP triangulation, and forensic PDF reporting.',
      tags: ['Full Stack', 'Forensics', 'Security Engineering']
    },
    {
      name: 'Cyber Intel Specialist',
      role: 'Threat Intelligence & Rule Engine Engineer',
      bio: 'Implemented SPF/DKIM/DMARC cryptographic validation heuristics and urgency NLP classification models.',
      tags: ['NLP', 'Threat Intel', 'Cryptography']
    },
    {
      name: 'Frontend / UI Systems Engineer',
      role: 'Product Designer & UI Engineer',
      bio: 'Designed the MailShield dark theme design system, interactive Leaflet geo-routing, and telemetry dashboards.',
      tags: ['UI/UX', 'Tailwind', 'Framer Motion']
    }
  ];

  return (
    <PageTransition className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2">
          <Badge status="Safe" size="sm">ENTERPRISE CYBER DEFENSE</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-text-primary tracking-tight">
          About MailShield AI
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          Pioneering next-generation email threat triage, autonomous MTA trajectory mapping, and transparent AI explainability for national cyber defense.
        </p>
      </div>

      {/* 1. Problem Statement & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScrollReveal delay={0.1}>
          <GlassCard glow="red" className="p-8 space-y-4 h-full">
            <div className="flex items-center gap-2 text-danger">
              <Lock size={20} />
              <h2 className="text-xl font-heading font-bold text-text-primary">
                The Cybersecurity Challenge
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Email remains the #1 initial intrusion vector for over 90% of cyber attacks globally.
              Attackers utilize sophisticated spoofed envelope headers, lookalike domain punycode, open MTA relays, and multi-national IP hops to disguise their genuine geolocation and bypass traditional spam filters.
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              When incident response analysts receive an employee alert, manual header dissection takes up to 30 minutes per message — an unsustainable bottleneck during active credential harvesting campaigns.
            </p>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <GlassCard glow="green" className="p-8 space-y-4 h-full">
            <div className="flex items-center gap-2 text-accent">
              <Shield size={20} />
              <h2 className="text-xl font-heading font-bold text-text-primary">
                The MailShield AI Solution
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              MailShield AI automates the entire forensic lifecycle in under 3 seconds. It decomposes the complete RFC 5322 header tree, cross-verifies SPF, DKIM, and DMARC records, and triangulates every transit IP address across global ASNs on an interactive Leaflet map.
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Crucially, MailShield bridges technical telemetry and executive action: an embedded AI Copilot translates cryptographic proof into clear, actionable plain English and exports SHA-256 sealed court-ready incident reports.
            </p>
          </GlassCard>
        </ScrollReveal>
      </div>

      {/* 2. Architecture & Tech Stack */}
      <ScrollReveal>
        <GlassCard className="p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-text-primary">
                Enterprise Technology Stack
              </h2>
              <p className="text-xs text-text-muted">Production-grade tools selected for maximum speed, security, and developer ergonomics</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/MailShield_AI_Technical_Stack_Architecture.pdf"
                download="MailShield_AI_Technical_Stack_Architecture.pdf"
                className="inline-flex"
              >
                <Button variant="outline" size="sm" icon={<Download size={14} />}>
                  Download Stack PDF
                </Button>
              </a>
              <Badge status="Info" size="sm">MONOREPO ARCHITECTURE</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl bg-surface/70 border border-border/70 space-y-1 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-text-primary">{tech.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {tech.category}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 3. Team Section */}
      <ScrollReveal>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
              Core Engineering Team
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Built for enterprise security operations & digital forensic intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <GlassCard key={member.name} glow="blue" className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-heading font-bold text-xl mx-auto shadow-glow-primary">
                  {member.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-text-primary">{member.name}</h3>
                  <p className="text-xs text-primary font-semibold font-mono">{member.role}</p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{member.bio}</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {member.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </PageTransition>
  );
};
