import type { Metadata } from "next";
import "./globals.css";

import { PreferencesProvider } from "@/components/PreferencesProvider";
import MoneyvaHeader from "@/components/MoneyvaHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moneyva.in"),

  title: {
    default: "Moneyva – Salary & Financial Calculators for India",
    template: "%s | Moneyva",
  },

  description:
    "Free salary and financial calculators for India. Calculate CTC to in-hand salary, salary hikes, income tax, PF, gratuity and more with Moneyva.",

  keywords: [
    "salary calculator",
    "salary hike calculator",
    "salary increment calculator",
    "CTC calculator",
    "CTC to in hand salary calculator",
    "in hand salary calculator",
    "salary calculator India",
    "income tax calculator",
    "PF calculator",
    "gratuity calculator",
    "Moneyva",
  ],

  alternates: {
    canonical: "https://www.moneyva.in/",
  },

  openGraph: {
    title: "Moneyva – Salary & Financial Calculators for India",
    description:
      "Free salary and financial calculators for India. Calculate CTC, in-hand salary, salary hikes, PF, tax and more.",
    url: "https://www.moneyva.in/",
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Moneyva",
  url: "https://www.moneyva.in/",
  description:
    "Free salary and financial calculators for India, including CTC, in-hand salary and salary hike calculators.",
  inLanguage: "en-IN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        <PreferencesProvider>
          <MoneyvaHeader />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}