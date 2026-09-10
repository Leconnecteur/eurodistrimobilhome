export type LeadType =
  | "CONTACT"
  | "MOBILHOME_INFO"
  | "BUYBACK"
  | "GENERAL";

export type LeadSource =
  | "website"
  | "whatsapp"
  | "phone"
  | "facebook"
  | "instagram"
  | "leboncoin"
  | "referral"
  | "other";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_DISCUSSION"
  | "VISIT_SCHEDULED"
  | "NEGOTIATION"
  | "SOLD"
  | "LOST";

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "IN_DISCUSSION",
  "VISIT_SCHEDULED",
  "NEGOTIATION",
  "SOLD",
  "LOST",
];

export const LEAD_SOURCES: LeadSource[] = [
  "website",
  "whatsapp",
  "phone",
  "facebook",
  "instagram",
  "leboncoin",
  "referral",
  "other",
];

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  mobileHomeId?: string;
  mobileHomeReference?: string;
  source: LeadSource;
  status: LeadStatus;
  read: boolean;
  createdAt: number;
  updatedAt: number;
}

export type LeadInput = Omit<
  Lead,
  "id" | "createdAt" | "updatedAt" | "status" | "read"
>;

export interface LeadNote {
  id: string;
  leadId: string;
  text: string;
  author: string;
  createdAt: number;
}

export type ActivityAction =
  | "LEAD_RECEIVED"
  | "CONTACTED"
  | "NOTE_ADDED"
  | "STATUS_CHANGED"
  | "ARCHIVED";

export interface LeadActivity {
  id: string;
  leadId: string;
  action: ActivityAction;
  detail?: string;
  author: string;
  createdAt: number;
}
