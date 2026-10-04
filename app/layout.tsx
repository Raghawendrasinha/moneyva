import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import MoneyvaHeader from "@/components/MoneyvaHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://moneyva.in"),

  title: {
    default: "Moneyva – Salary & Financial Calculators for India",
    template: "%s | Moneyva",
  },

  description:
    "Free salary and financial calculators for India. Calculate CTC to in-hand salary, income tax, PF, gratuity and more with Moneyva.",

  keywords: [
    "salary calculator",
    "CTC calculator",
    "in hand salary calculator",
    "CTC to in hand salary",
    "salary calculator India",
    "income tax calculator",
    "PF calculator",
    "gratuity calculator",
    "Moneyva",
  ],

  alternates: {
    canonical: "https://moneyva.in",
  },

  openGraph: {
    title: "Moneyva – Salary & Financial Calculators for India",
    description:
      "Free salary and financial calculators for India. Calculate your CTC, in-hand salary, PF, tax and more.",
    url: "https://moneyva.in",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Moneyva – Salary & Financial Calculators for India",
    description:
      "Free salary and financial calculators for India.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PreferencesProvider>
          <MoneyvaHeader />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}