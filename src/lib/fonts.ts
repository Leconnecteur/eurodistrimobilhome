import { Inter, Manrope } from "next/font/google";

export const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${inter.variable} ${manrope.variable}`;
