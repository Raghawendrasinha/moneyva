import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTC to In-Hand Salary Calculator",
  description:
    "Calculate your monthly in-hand salary from CTC in India. Estimate basic salary, HRA, PF, deductions and take-home pay with Moneyva.",
  alternates: {
    canonical: "https://www.moneyva.in/ctc-calculator",
  },
  openGraph: {
    title: "CTC to In-Hand Salary Calculator | Moneyva",
    description:
      "Calculate your estimated monthly in-hand salary from CTC in India.",
    url: "https://www.moneyva.in/ctc-calculator",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
};

export default function CTCLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
