import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Sun, Moon, Menu, X, ArrowRight, Activity, Terminal } from 'lucide-react';
import { Button } from './Button';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Scan Email', path: '/scan' },
    { name: 'Threat Dashboard', path: '/dashboard' },
    { name: 'History', path: '/history' },
    { name: 'About & Team', path: '/about' }
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 dark:bg-background/80 backdrop-blur-xl border-b border-border/80 shadow-lg'
          : 'bg-transparent border-b border-border/40'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0 shadow-glow-primary border border-primary/40 bg-surface">
            <img
              src="/mailshield-logo.png"
              alt="MailShield AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-text-primary dark:text-text-primary">
                MailShield
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40">
                AI
              </span>
            </div>
            <span className="text-[10px] text-text-muted tracking-widest uppercase block -mt-1 font-mono">
              Cyber Forensics Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/50 border border-border/60 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 font-heading',
                  isActive
                    ? 'bg-primary text-white shadow-glow-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Component Showcase Link for dev / judges */}
          <Link
            to="/dev/components"
            title="Design System Showcase"
            className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-surface transition-colors"
          >
            <Terminal size={18} />
          </Link>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-border/80 bg-surface/60 hover:bg-surface text-text-muted hover:text-text-primary transition-all duration-200"
          >
            {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
          </button>

          {/* Scan Now CTA */}
          <Link to="/scan">
            <Button size="sm" variant="primary" icon={<ArrowRight size={14} />} iconPosition="right">
              Scan Email
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border bg-surface text-text-muted"
          >
            {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-border bg-surface text-text-primary"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface/95 backdrop-blur-2xl px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link to="/scan" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" variant="primary" className="w-full">
                Scan Email Now
              </Button>
            </Link>
            <Link to="/dev/components" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="outline" className="w-full">
                Design System Preview
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
