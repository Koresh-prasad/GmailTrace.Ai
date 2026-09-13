import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { LandingPage } from './pages/LandingPage';
import { ScanPage } from './pages/ScanPage';
import { ResultsPage } from './pages/ResultsPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ComponentShowcasePage } from './pages/ComponentShowcasePage';
import { FloatingCopilot } from './components/chat/FloatingCopilot';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-primary selection:text-white relative">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/results/:scanId" element={<ResultsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dev/components" element={<ComponentShowcasePage />} />
          </Routes>
        </main>
        <Footer />
        {/* Phase 5 Floating AI Copilot Widget across all pages */}
        <FloatingCopilot />
      </div>
    </BrowserRouter>
  );
}
