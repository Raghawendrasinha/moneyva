import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Moneyva's Privacy Policy to understand how information is handled when you use our financial calculators and contact services.",
  alternates: {
    canonical: "https://www.moneyva.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Moneyva",
    description:
      "Learn how Moneyva handles contact information, calculator usage, browser preferences, and support requests.",
    url: "https://www.moneyva.in/privacy",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
