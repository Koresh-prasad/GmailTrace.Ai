import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, Lock, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border/70 bg-surface/30 backdrop-blur-md pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/50">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-glow-primary border border-primary/40 bg-surface">
                <img
                  src="/mailshield-logo.png"
                  alt="MailShield AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-heading font-extrabold text-lg text-text-primary">
                MailShield AI
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Forensic-grade email threat detection, visual IP routing, and AI explainability built for CERT-In standards and cyber intelligence teams.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Enterprise Security Protocol · Active Defense
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text-primary">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link to="/scan" className="hover:text-primary transition-colors">
                  Instant Email Scanner
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Threat Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-primary transition-colors">
                  Forensic History
                </Link>
              </li>
              <li>
                <Link to="/dev/components" className="hover:text-primary transition-colors">
                  Component Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Forensic Standards */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text-primary">
              Security Compliance
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li className="flex items-center gap-1.5">
                <Lock size={12} className="text-accent" />
                <span>RFC 7208 (SPF) Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock size={12} className="text-accent" />
                <span>RFC 6376 (DKIM) Cryptographic Check</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock size={12} className="text-accent" />
                <span>RFC 7489 (DMARC) Alignment</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu size={12} className="text-accent" />
                <span>SHA-256 Chain of Custody Proof</span>
              </li>
            </ul>
          </div>

          {/* Standards & Incident Response */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text-primary">
              Emergency Response
            </h4>
            <p className="text-xs text-text-muted">
              Automated integration and export for CERT-In incident reporting templates.
            </p>
            <div className="p-3 rounded-xl bg-surface/80 border border-border/80 text-[11px] text-text-muted space-y-1">
              <div className="flex items-center gap-1 text-danger font-semibold">
                <ShieldAlert size={13} />
                <span>National Cyber Threat Warning</span>
              </div>
              <p>For active phishing campaigns, extract case report PDF and file immediate dispatch.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© 2026 MailShield AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Forensic Integrity</span>
            <Link to="/about" className="hover:text-text-primary transition-colors">
              Team & Credits
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
