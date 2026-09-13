export type Verdict = 'Safe' | 'Suspicious' | 'Malicious';

export interface EmailHop {
  id?: number;
  scan_id?: string;
  hop_order: number;
  ip: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  asn: string;
  isp?: string;
  timestamp?: string;
  isOrigin?: boolean;
  isMismatch?: boolean;
}

export interface EmailLink {
  id?: number;
  scan_id?: string;
  url: string;
  display_text: string;
  is_suspicious: boolean;
  threat_type?: string;
}

export interface EmailAttachment {
  id?: number;
  scan_id?: string;
  filename: string;
  file_type: string;
  size?: number;
  verdict: Verdict;
  suspicious_reasons?: string[];
}

export interface AuthChecks {
  spf: { status: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE'; details?: string };
  dkim: { status: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE'; details?: string };
  dmarc: { status: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE'; details?: string };
}

export interface ScanResult {
  id: string;
  created_at: string;
  sender: string;
  recipient?: string;
  subject: string;
  date?: string;
  risk_score: number;
  verdict: Verdict;
  spf_result: string;
  dkim_result: string;
  dmarc_result: string;
  flagged_reasons: string[];
  ai_explanation: string;
  raw_email_hash: string;
  hops: EmailHop[];
  links: EmailLink[];
  attachments: EmailAttachment[];
  phishing_language_confidence: number;
  suspicious_links_count: number;
  claimed_sender_geo?: {
    country: string;
    city: string;
  };
}

export interface DashboardStats {
  total_scans: number;
  threats_blocked: number;
  avg_risk_score: number;
  active_alerts: number;
  recent_scans: ScanResult[];
  threat_distribution: { name: string; value: number }[];
  threats_over_time: { date: string; threats: number; scans: number }[];
  top_attacking_countries: { country: string; count: number; code: string }[];
  graph_data: {
    nodes: { id: string; name: string; group: string; val: number }[];
    links: { source: string; target: string; value: number }[];
  };
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}
