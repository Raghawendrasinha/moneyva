import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Moneyva with your questions, feedback or queries about our financial calculators.",
  alternates: {
    canonical: "https://www.moneyva.in/contact",
  },
  openGraph: {
    title: "Contact Us | Moneyva",
    description:
      "Send Moneyva a question, suggestion or query about our financial calculators.",
    url: "https://www.moneyva.in/contact",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
