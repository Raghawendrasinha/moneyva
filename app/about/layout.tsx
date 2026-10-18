import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Moneyva",
  description:
    "Learn about Moneyva, a financial calculator platform that helps people in India understand salary, salary hikes, and investment projections.",
  alternates: {
    canonical: "https://www.moneyva.in/about",
  },
  openGraph: {
    title: "About Moneyva",
    description:
      "Discover Moneyva's mission to make everyday financial calculations easier to understand.",
    url: "https://www.moneyva.in/about",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
