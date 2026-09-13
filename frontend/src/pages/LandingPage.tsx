import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  MapPin,
  FileText,
  FileCheck2,
  Lock,
  Cpu,
  Globe2,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  Fingerprint,
  Radio,
  Server,
  Terminal
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageTransition } from '../components/ui/PageTransition';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: 'Phishing Detection',
      description: 'Multi-layer NLP parser detects social engineering, urgency patterns, and spoofed sender domains.',
      glow: 'blue' as const
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: 'GeoIP Route Tracing',
      description: 'Visualizes the full transit chain across international autonomous systems (ASNs) from hop zero to recipient.',
      glow: 'green' as const
    },
    {
      icon: <Lock className="w-6 h-6 text-danger" />,
      title: 'Attachment Sandbox',
      description: 'Static heuristic analysis flags malicious macro payloads, double extensions (.pdf.exe), and suspicious MIME types.',
      glow: 'red' as const
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'AI Copilot Explainability',
      description: 'Translates complex cryptographic failures and telemetry into plain-English executive summaries in real time.',
      glow: 'blue' as const
    },
    {
      icon: <FileText className="w-6 h-6 text-accent" />,
      title: 'Forensic PDF Reports',
      description: 'Court-admissible tamper-evident reports with SHA-256 evidence hashing for CERT-In incident filing.',
      glow: 'green' as const
    },
    {
      icon: <Globe2 className="w-6 h-6 text-warning" />,
      title: 'Multilingual Detection',
      description: 'Identifies homograph attacks, punycode spoofing, and localized phishing campaigns targeting Indian languages.',
      glow: 'amber' as const
    }
  ];

  return (
    <PageTransition className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Animated Cyber Grid & Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.22),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Ambient Floating Orbs */}
        <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-20">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold backdrop-blur-md"
          >
            <Radio size={14} className="animate-pulse text-primary" />
            <span>AI-POWERED EMAIL CYBER FORENSICS PLATFORM</span>
          </motion.div>

          {/* Large Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black tracking-tight leading-[1.08] text-text-primary dark:text-text-primary">
              Detect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">Trace.</span> Prove.
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-muted leading-relaxed font-normal">
              AI-powered email threat detection with forensic-grade geolocation tracing.
              Unmask spoofed senders, uncover hidden server hops, and produce tamper-proof CERT-In audit reports.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/scan" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={<ArrowRight size={18} />} iconPosition="right" className="w-full sm:w-auto">
                Scan an Email Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={scrollToDemo} className="w-full sm:w-auto">
              See Live Demo
            </Button>
          </motion.div>

          {/* Micro badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-text-muted font-mono"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-accent" /> SPF / DKIM / DMARC Validation
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" /> Multi-Hop IP Triangulation
            </span>
            <span className="flex items-center gap-1.5">
              <Fingerprint size={14} className="text-accent" /> SHA-256 Custody Hash
            </span>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-border/80 bg-surface/50 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-primary">
              <AnimatedCounter value={10} suffix="M+" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted uppercase tracking-wider font-semibold">
              Threats Analyzed
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-accent">
              <AnimatedCounter value={150} suffix="+" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted uppercase tracking-wider font-semibold">
              Countries Traced
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-primary">
              <AnimatedCounter value={99.2} decimals={1} suffix="%" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted uppercase tracking-wider font-semibold">
              Detection Accuracy
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-accent">
              <AnimatedCounter value={5} prefix="< " suffix="s" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted uppercase tracking-wider font-semibold">
              Avg Scan Time
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <Badge status="Safe" size="md">CYBER INVESTIGATION WORKFLOW</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary">
            How MailShield Forensics Works
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto">
            From raw email headers to court-admissible forensic intelligence in seconds.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <ScrollReveal delay={0.1}>
            <GlassCard glow="blue" className="h-full space-y-4 text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center mx-auto shadow-glow-primary">
                <FileCheck2 size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                STEP 01
              </span>
              <h3 className="text-xl font-heading font-bold text-text-primary">
                1. Ingest Email (.EML or Headers)
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Drag-and-drop any standard <code>.eml</code> message or paste raw RFC 5322 headers. The parser automatically extracts the cryptographic envelope.
              </p>
            </GlassCard>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal delay={0.2}>
            <GlassCard glow="green" className="h-full space-y-4 text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto shadow-glow-accent">
                <Cpu size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10">
                STEP 02
              </span>
              <h3 className="text-xl font-heading font-bold text-text-primary">
                2. AI & GeoIP Route Analysis
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Evaluates SPF/DKIM/DMARC, traces each intermediate MTA relay node on the global map, and runs NLP classification on psychological urgency cues.
              </p>
            </GlassCard>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal delay={0.3}>
            <GlassCard glow="blue" className="h-full space-y-4 text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center mx-auto shadow-glow-primary">
                <FileText size={28} />
              </div>
              <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                STEP 03
              </span>
              <h3 className="text-xl font-heading font-bold text-text-primary">
                3. Forensic Report & CERT-In Dispatch
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Receive an animated risk score, visual world map trajectory, AI Copilot explanation, and download a verifiable PDF with SHA-256 chain of custody.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. FEATURE GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge status="Info" size="md">ENTERPRISE-GRADE CAPABILITIES</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary">
            Comprehensive Email Defense Matrix
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto">
            Engineered to detect zero-day spear phishing, business email compromise (BEC), and state-sponsored routing masquerades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1}>
              <GlassCard glow={f.glow} interactive className="h-full flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-text-primary">
                    {f.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {f.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>Explore Feature</span>
                  <ArrowRight size={13} />
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE DEMO PREVIEW SECTION */}
      <section ref={demoRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal>
          <GlassCard className="p-8 sm:p-12 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge status="Suspicious" size="md">LIVE INVESTIGATION SIMULATION</Badge>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary">
                  See Phishing Unmasked in Real Time
                </h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  Try our pre-seeded hacker campaign: an email spoofing a Corporate IT Security alert.
                  Watch MailShield AI trace the actual mail origin to an unauthorized Russian relay node, while the claimed sender domain fails DMARC alignment.
                </p>
                <div className="space-y-3 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-danger" />
                    <span>Spoofed from: <code>security-alerts@bank-corp-security-login.top</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span>Detected Relaying IP: <code>185.220.101.5</code> (Moscow, RU)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>Malicious link disguised as MFA Portal</span>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => navigate('/scan?demo=phishing')}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Test Sample Phishing Email
                  </Button>
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => navigate('/scan?demo=safe')}
                  >
                    Test Clean Email
                  </Button>
                </div>
              </div>

              {/* Mock Terminal Card */}
              <div className="rounded-xl bg-surface/90 border border-border/80 p-5 font-mono text-xs text-text-muted space-y-3 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger/80" />
                    <div className="w-3 h-3 rounded-full bg-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-accent/80" />
                  </div>
                  <span className="text-[11px] text-text-muted font-semibold">mailshield-forensics-cli v1.0</span>
                </div>
                <div className="space-y-1.5 leading-relaxed">
                  <p className="text-primary font-semibold">$ mailshield scan --inspect sample-alert.eml</p>
                  <p className="text-accent">✓ RFC-5322 header tree parsed (2 received hops)</p>
                  <p className="text-danger">✗ SPF verification failed: IP 185.220.101.5 unauthorized</p>
                  <p className="text-danger">✗ DKIM signature corrupted or missing</p>
                  <p className="text-danger">✗ DMARC policy enforcement: REJECT</p>
                  <p className="text-warning">⚠ GeoIP mismatch: Claimed US Corporate vs Real Moscow (RU)</p>
                  <p className="text-text-primary font-bold pt-2">
                    Verdict: <span className="text-danger">MALICIOUS (Risk: 94/100)</span>
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* 6. TRUST SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase font-mono tracking-widest text-text-muted">
            Engineered For High-Stakes Threat Triage
          </p>
          <h3 className="text-2xl font-heading font-bold text-text-primary">
            Built for CERT-In Grade Forensic Standards
          </h3>
        </div>

        {/* Mock Partner Logo Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-text-primary">
            <Shield className="w-5 h-5 text-primary" /> CERT-In Ready
          </div>
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-text-primary">
            <Server className="w-5 h-5 text-accent" /> RFC 7208 / 7489
          </div>
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-text-primary">
            <Fingerprint className="w-5 h-5 text-primary" /> NIST SP 800-86
          </div>
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-text-primary">
            <Lock className="w-5 h-5 text-danger" /> ISO/IEC 27037
          </div>
        </div>
      </section>
    </PageTransition>
  );
};
