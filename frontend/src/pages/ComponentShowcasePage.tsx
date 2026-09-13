import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RiskGauge } from '../components/ui/RiskGauge';
import { StepProgress } from '../components/ui/StepProgress';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageTransition } from '../components/ui/PageTransition';
import { Shield, AlertTriangle, ArrowRight, Zap, Play, Terminal } from 'lucide-react';

export const ComponentShowcasePage: React.FC = () => {
  const [sliderScore, setSliderScore] = useState(78);
  const [activeStep, setActiveStep] = useState(2);

  const sampleSteps = [
    { id: 1, label: 'Parsing Headers', description: 'Extract RFC-5322 received headers' },
    { id: 2, label: 'SPF/DKIM/DMARC', description: 'Cryptographic identity check' },
    { id: 3, label: 'AI Phishing Classifier', description: 'Transformer semantic evaluation' },
    { id: 4, label: 'GeoIP Route Tracing', description: 'Autonomous ASN & ISP mapping' },
    { id: 5, label: 'Risk Score Verdict', description: 'Multi-vector threat aggregation' }
  ];

  return (
    <PageTransition className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-border/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
            <Terminal size={14} />
            <span>Phase 1 Design System & Storybook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary mt-1">
            MailShield UI Component System
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Design tokens: Space Grotesk headings, Inter body, Deep Navy (#0B0F19), Electric Blue (#3B82F6), Cyber Green (#10B981).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status="Safe" size="md">RFC COMPLIANT</Badge>
          <Badge status="Info" size="md">DARK/LIGHT READY</Badge>
        </div>
      </div>

      {/* 1. GlassCard Showcase */}
      <ScrollReveal>
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
            <span>1. &lt;GlassCard&gt; Variants</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard glow="blue" interactive>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Shield size={18} />
                <h3 className="font-heading font-bold text-sm">Glow Blue (Primary)</h3>
              </div>
              <p className="text-xs text-text-muted">
                Electric blue border glow on hover. Frosted glass backdrop-filter with deep surface glass.
              </p>
            </GlassCard>

            <GlassCard glow="green" interactive>
              <div className="flex items-center gap-2 text-accent mb-2">
                <Shield size={18} />
                <h3 className="font-heading font-bold text-sm">Glow Green (Accent)</h3>
              </div>
              <p className="text-xs text-text-muted">
                Cyber green glow for safe authentication metrics and passed integrity checks.
              </p>
            </GlassCard>

            <GlassCard glow="red" interactive>
              <div className="flex items-center gap-2 text-danger mb-2">
                <AlertTriangle size={18} />
                <h3 className="font-heading font-bold text-sm">Glow Red (Danger)</h3>
              </div>
              <p className="text-xs text-text-muted">
                High-threat alert panel with emergency red glow and high contrast alert cues.
              </p>
            </GlassCard>

            <GlassCard glow="amber" interactive>
              <div className="flex items-center gap-2 text-warning mb-2">
                <AlertTriangle size={18} />
                <h3 className="font-heading font-bold text-sm">Glow Amber (Warning)</h3>
              </div>
              <p className="text-xs text-text-muted">
                Suspicious hop or unverified DKIM selector indicator card with warning glow.
              </p>
            </GlassCard>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Button Showcase */}
      <ScrollReveal>
        <GlassCard className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-text-primary">
            2. &lt;Button&gt; Variants & Micro-animations
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={<ArrowRight size={16} />} iconPosition="right">
              Primary Button
            </Button>
            <Button variant="accent" icon={<Zap size={16} />}>
              Cyber Green Action
            </Button>
            <Button variant="danger">
              High Threat Action
            </Button>
            <Button variant="outline">
              Outline Glass
            </Button>
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button variant="primary" isLoading>
              Loading State
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/50">
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary">Large</Button>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 3. Badge Showcase */}
      <ScrollReveal>
        <GlassCard className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">
            3. &lt;Badge&gt; Status Pills
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Badge status="Safe">Safe (RFC Pass)</Badge>
            <Badge status="Suspicious">Suspicious (Domain Mismatch)</Badge>
            <Badge status="Malicious">Malicious (Spoofed Header)</Badge>
            <Badge status="PASS" size="sm">SPF: PASS</Badge>
            <Badge status="FAIL" size="sm">DKIM: FAIL</Badge>
            <Badge status="Info" size="sm">IP Route ASN 13335</Badge>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 4. RiskGauge Showcase */}
      <ScrollReveal>
        <GlassCard className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-text-primary">
                4. &lt;RiskGauge&gt; Dynamic Circular Ring
              </h2>
              <p className="text-xs text-text-muted">
                Adjust slider below to verify color shifts: Safe (&lt;30) → Suspicious (30-70) → Malicious (&gt;70)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-muted">Interactive Score:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderScore}
                onChange={(e) => setSliderScore(Number(e.target.value))}
                className="w-36 accent-primary"
              />
              <span className="text-sm font-mono font-bold w-8 text-right">{sliderScore}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-8 py-4">
            <div className="text-center space-y-2">
              <RiskGauge score={sliderScore} size={190} />
              <p className="text-xs text-text-muted">Controlled by Slider</p>
            </div>
            <div className="text-center space-y-2">
              <RiskGauge score={12} size={150} />
              <p className="text-xs text-text-muted">Clean Email (12/100)</p>
            </div>
            <div className="text-center space-y-2">
              <RiskGauge score={54} size={150} />
              <p className="text-xs text-text-muted">Suspicious Hops (54/100)</p>
            </div>
            <div className="text-center space-y-2">
              <RiskGauge score={94} size={150} />
              <p className="text-xs text-text-muted">Confirmed Phishing (94/100)</p>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 5. StepProgress Showcase */}
      <ScrollReveal>
        <GlassCard className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-text-primary">
                5. &lt;StepProgress&gt; Animated Stepper
              </h2>
              <p className="text-xs text-text-muted">
                Used in /scan for live verification and email hop timeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
              >
                Previous Step
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setActiveStep((prev) => Math.min(sampleSteps.length, prev + 1))}
                disabled={activeStep >= sampleSteps.length}
              >
                Next Step
              </Button>
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-xs font-mono text-text-muted uppercase mb-4">Horizontal Scan Mode:</h3>
            <StepProgress steps={sampleSteps} currentStepIndex={activeStep} orientation="horizontal" />
          </div>

          <div className="pt-6 border-t border-border/50">
            <h3 className="text-xs font-mono text-text-muted uppercase mb-4">Vertical Hop Timeline Mode:</h3>
            <StepProgress steps={sampleSteps.slice(0, 3)} currentStepIndex={activeStep} orientation="vertical" />
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* 6. AnimatedCounter Showcase */}
      <ScrollReveal>
        <GlassCard className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-text-primary">
            6. &lt;AnimatedCounter&gt; Landing Page Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-surface/60 border border-border/60">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
                <AnimatedCounter value={10} suffix="M+" />
              </div>
              <p className="text-xs text-text-muted mt-1">Threats Analyzed</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/60 border border-border/60">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-accent">
                <AnimatedCounter value={150} suffix="+" />
              </div>
              <p className="text-xs text-text-muted mt-1">Countries Traced</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/60 border border-border/60">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
                <AnimatedCounter value={99.2} decimals={1} suffix="%" />
              </div>
              <p className="text-xs text-text-muted mt-1">Detection Accuracy</p>
            </div>
            <div className="p-4 rounded-xl bg-surface/60 border border-border/60">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-accent">
                <AnimatedCounter value={5} prefix="< " suffix="s" />
              </div>
              <p className="text-xs text-text-muted mt-1">Avg Scan Time</p>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>
    </PageTransition>
  );
};
