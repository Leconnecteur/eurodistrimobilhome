export type BuybackStatus =
  | "NEW"
  | "REVIEWING"
  | "CONTACTED"
  | "OFFER_SENT"
  | "ACCEPTED"
  | "REFUSED"
  | "CLOSED";

export const BUYBACK_STATUSES: BuybackStatus[] = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "OFFER_SENT",
  "ACCEPTED",
  "REFUSED",
  "CLOSED",
];

export interface BuybackImage {
  url: string;
  storagePath: string;
}

export interface BuybackRequest {
  id: string;
  // MobilHome info
  brand: string;
  model: string;
  year: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  country: string;
  condition: string;
  description: string;
  desiredPrice: number | null;
  terrace: boolean;
  airConditioning: boolean;
  heating: boolean;
  furnished: boolean;
  otherEquipment: string;
  images: BuybackImage[];

  // Seller info
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  sellerCountry: string;
  sellerCity: string;
  consent: boolean;

  status: BuybackStatus;
  archived: boolean;
  read: boolean;
  createdAt: number;
  updatedAt: number;
}

export type BuybackRequestInput = Omit<
  BuybackRequest,
  "id" | "status" | "archived" | "read" | "createdAt" | "updatedAt"
>;

export interface BuybackNote {
  id: string;
  buybackId: string;
  text: string;
  author: string;
  createdAt: number;
}

export interface BuybackActivity {
  id: string;
  buybackId: string;
  action: string;
  detail?: string;
  author: string;
  createdAt: number;
}
