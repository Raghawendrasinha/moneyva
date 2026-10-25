import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income Tax Calculator India Tax Year 2026–27 | Moneyva",
  description:
    "Estimate your income tax in India for Tax Year 2026–27. Compare the new and old tax regimes, deductions, rebates and cess with Moneyva's free income tax calculator.",
  keywords: [
    "income tax calculator",
    "income tax calculator India",
    "income tax calculator 2026-27",
    "new vs old tax regime calculator",
    "tax calculator India",
    "salary tax calculator",
  ],
  alternates: {
    canonical: "https://www.moneyva.in/income-tax-calculator",
  },
  openGraph: {
    title: "Income Tax Calculator India 2026–27 | Moneyva",
    description:
      "Compare estimated tax under India's new and old tax regimes with Moneyva's free income tax calculator.",
    url: "https://www.moneyva.in/income-tax-calculator",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Income Tax Calculator India | Moneyva",
    description:
      "Estimate income tax and compare the new and old tax regimes for Tax Year 2026–27.",
  },
};

export default function IncomeTaxCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
