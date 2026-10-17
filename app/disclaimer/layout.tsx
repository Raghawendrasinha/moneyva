import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer – Financial Calculator Information",
  description:
    "Read Moneyva's disclaimer covering salary and tax estimates, SIP projections, investment risks, accuracy of calculations and user responsibility.",
  alternates: {
    canonical: "https://www.moneyva.in/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Moneyva",
    description:
      "Important information about Moneyva's financial calculators, estimates and investment projections.",
    url: "https://www.moneyva.in/disclaimer",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
};

export default function DisclaimerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
