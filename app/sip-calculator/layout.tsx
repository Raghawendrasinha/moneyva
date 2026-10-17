import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator – Estimate Mutual Fund Returns",
  description:
    "Calculate the estimated future value of your monthly SIP investments. Include expected annual returns, investment duration and an optional annual step-up with Moneyva.",
  keywords: [
    "SIP calculator",
    "SIP calculator India",
    "mutual fund calculator",
    "monthly investment calculator",
    "step up SIP calculator",
    "SIP returns calculator",
  ],
  alternates: {
    canonical: "https://www.moneyva.in/sip-calculator",
  },
  openGraph: {
    title: "SIP Calculator – Estimate Mutual Fund Returns | Moneyva",
    description:
      "Estimate your SIP investment, potential returns and future value with Moneyva's free SIP calculator.",
    url: "https://www.moneyva.in/sip-calculator",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SIP Calculator | Moneyva",
    description:
      "Estimate monthly SIP investments and potential future returns.",
  },
};

export default function SipCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
