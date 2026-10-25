import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTC to In-Hand Salary Calculator – Take-Home Pay | Moneyva",
  description:
    "Calculate your in-hand salary from CTC in India. Estimate monthly take-home pay after PF, income tax and other salary deductions with Moneyva.",
  alternates: {
    canonical: "https://www.moneyva.in/ctc-calculator",
  },
  openGraph: {
    title: "CTC to In-Hand Salary Calculator – Take-Home Pay | Moneyva",
    description:
      "Estimate your monthly take-home pay from CTC after PF, income tax and other salary deductions.",
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
