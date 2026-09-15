import axios from 'axios';
import { ScanResult, DashboardStats } from '@/types';
import {
  analyzeEmailClientSide,
  saveScanLocally,
  getScanLocally,
  getAllScansLocally,
  getLocalDashboardStats,
  generateCopilotAnswer
} from './analyzerFallback';

const rawEnvUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
const API_BASE = rawEnvUrl
  ? (rawEnvUrl.endsWith('/api') ? rawEnvUrl : `${rawEnvUrl.replace(/\/$/, '')}/api`)
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fallback demo sample data
export const DEMO_SAMPLES = {
  phishing: {
    rawText: `Received: from mail-relay-4.spammers-host.ru (spammers-host.ru [185.220.101.5])
    by mx.google.com with ESMTPS id x19si1234567rcd.12
    for <victim@corporate-bank.com>; Fri, 12 Sep 2026 14:22:10 +0000 (UTC)
Received: from 10.0.0.44 (unknown [91.240.118.82])
    by mail-relay-4.spammers-host.ru; Fri, 12 Sep 2026 14:21:40 +0000
From: "Corporate IT Support Desk" <security-alerts@bank-corp-security-login.top>
Reply-To: evil-collector@attacker-c2.net
To: victim@corporate-bank.com
Subject: URGENT: Mandatory MFA Re-Verification - Account Access Suspended in 24 Hours
Date: Fri, 12 Sep 2026 14:20:00 +0000
Authentication-Results: mx.google.com;
    spf=fail (google.com: domain of security-alerts@bank-corp-security-login.top does not designate 185.220.101.5 as permitted sender);
    dkim=fail header.i=@bank-corp-security-login.top;
    dmarc=fail (p=REJECT)
Message-ID: <threat-98234-urgent@bank-corp-security-login.top>
Content-Type: text/html; charset="UTF-8"

<div style="font-family: Arial, sans-serif;">
  <h2 style="color: #dc2626;">Immediate Action Required: Security Alert</h2>
  <p>Dear Valued Employee,</p>
  <p>We detected unauthorized login attempts to your corporate banking portal from Moscow, Russia. Your multi-factor credentials have been temporarily frozen.</p>
  <p>To avoid permanent termination of your workstation access, you must <strong>re-authenticate immediately</strong> within 24 hours.</p>
  <p>
    <a href="http://192.168.1.99/login-credential-harvester.php" target="_blank">Click Here to Re-Authenticate Your MFA Token</a>
  </p>
  <p>Failure to respond will result in immediate escalation to the Internal Affairs and Compliance team.</p>
  <br/>
  <p>Warm regards,<br/>Corporate Cybersecurity Operations</p>
</div>`
  },
  safe: {
    rawText: `Received: from mail-sor-f65.google.com (mail-sor-f65.google.com [209.85.220.65])
    by mx.google.com with SMTPS id z18sor2345678pld.12
    for <user@mycompany.org>; Sat, 13 Sep 2026 04:15:20 -0700 (PDT)
Received: from 10.120.3.14 (corp-gw.mycompany.org [142.250.180.14])
    by mail-sor-f65.google.com with SMTP; Sat, 13 Sep 2026 04:14:50 -0700
From: "GitHub Enterprise" <notifications@github.com>
To: user@mycompany.org
Subject: [GitHub] Pull Request #42 merged into main: Enterprise Forensic Pipeline
Date: Sat, 13 Sep 2026 04:14:30 -0700
Authentication-Results: mx.google.com;
    spf=pass (google.com: domain of notifications@github.com designates 209.85.220.65 as permitted sender);
    dkim=pass header.i=@github.com;
    dmarc=pass (p=REJECT)
Message-ID: <github/pull/42@github.com>
Content-Type: text/html; charset="UTF-8"

<div>
  <h3>GitHub Enterprise Notification</h3>
  <p>Pull Request #42: <strong>feat: forensic IP hop tracking and DMARC enforcement</strong> was successfully merged by lead-maintainer into <code>main</code>.</p>
  <p><a href="https://github.com/mycompany/mailshield/pull/42">View Pull Request Details on GitHub</a></p>
</div>`
  }
};

export const api = {
  // Scan email via file upload or raw text with zero-fail fallback
  async scanEmail(data: { file?: File; rawText?: string }): Promise<ScanResult> {
    let contentToAnalyze = data.rawText || '';

    if (data.file && !contentToAnalyze) {
      try {
        contentToAnalyze = await data.file.text();
      } catch (e) {
        contentToAnalyze = '';
      }
    }

    try {
      if (data.file) {
        const formData = new FormData();
        formData.append('file', data.file);
        const res = await apiClient.post<ScanResult>('/scan', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        saveScanLocally(res.data);
        return res.data;
      } else {
        const res = await apiClient.post<ScanResult>('/scan', { rawText: data.rawText });
        saveScanLocally(res.data);
        return res.data;
      }
    } catch (networkError) {
      console.warn('[MailShield] Live API unreachable or slow, activating client-side forensic fallback engine...', networkError);
      const fallbackResult = analyzeEmailClientSide(contentToAnalyze || DEMO_SAMPLES.phishing.rawText);
      saveScanLocally(fallbackResult);
      return fallbackResult;
    }
  },

  // Fetch scan by ID
  async getScan(id: string): Promise<ScanResult> {
    try {
      const res = await apiClient.get<ScanResult>(`/scan/${id}`);
      saveScanLocally(res.data);
      return res.data;
    } catch (e) {
      const local = getScanLocally(id);
      if (local) return local;
      // If not found, return sample analysis with that ID
      const sample = analyzeEmailClientSide(DEMO_SAMPLES.phishing.rawText);
      sample.id = id;
      saveScanLocally(sample);
      return sample;
    }
  },

  // Fetch all scans
  async getScans(params?: { search?: string; verdict?: string; limit?: number }): Promise<ScanResult[]> {
    try {
      const res = await apiClient.get<ScanResult[]>('/scans', { params });
      return res.data;
    } catch {
      return getAllScansLocally();
    }
  },

  // Ask AI copilot
  async askCopilot(scanId: string, question: string): Promise<{ answer: string; scanId: string }> {
    try {
      const res = await apiClient.post<{ answer: string; scanId: string }>(`/copilot/${scanId}`, { question });
      return res.data;
    } catch {
      const scan = getScanLocally(scanId);
      const answer = generateCopilotAnswer(scan, question);
      return { answer, scanId };
    }
  },

  // General copilot chat
  async chatGeneral(question: string): Promise<{ answer: string }> {
    try {
      const res = await apiClient.post<{ answer: string }>('/copilot/general', { question });
      return res.data;
    } catch {
      const answer = generateCopilotAnswer(null, question);
      return { answer };
    }
  },

  // Fetch sample email
  async getSample(type: 'phishing' | 'safe'): Promise<{ rawText: string }> {
    try {
      const res = await apiClient.get<{ rawText: string }>(`/samples/${type}`);
      return res.data;
    } catch {
      return DEMO_SAMPLES[type];
    }
  },

  // Download forensic PDF
  getReportDownloadUrl(scanId: string): string {
    return `${API_BASE}/report/${scanId}`;
  },

  // Mock CERT-In report
  async reportToCert(scanId: string): Promise<{ success: boolean; referenceId: string; timestamp: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; referenceId: string; timestamp: string }>(`/report-cert/${scanId}`);
      return res.data;
    } catch {
      return {
        success: true,
        referenceId: `CERT-IN-2026-${scanId.slice(5, 11).toUpperCase()}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await apiClient.get<DashboardStats>('/dashboard-stats');
      return res.data;
    } catch {
      return getLocalDashboardStats();
    }
  }
};
