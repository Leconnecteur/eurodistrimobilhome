export interface CompanySettings {
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  siret?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  showSoldMobilHomes: boolean;
  updatedAt: number;
}

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "Euro Distri Mobilhome",
  phone: "+33 0 00 00 00 00",
  whatsapp: "+33000000000",
  email: "contact@eurodistrimobilhome.com",
  address: "Adresse à renseigner — France",
  siret: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
  showSoldMobilHomes: true,
  updatedAt: 0,
};
