import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Hike Calculator – Hike % & New CTC | Moneyva",
  description:
    "Use this salary hike calculator to find your increment percentage, hike amount and new CTC in India. Enter your hike percentage or expected new CTC.",
  alternates: {
    canonical: "https://www.moneyva.in/salary-hike-calculator",
  },
  openGraph: {
    title: "Salary Hike Calculator – Hike % & New CTC | Moneyva",
    description:
      "Calculate your salary increment percentage, hike amount and new CTC with Moneyva.",
    url: "https://www.moneyva.in/salary-hike-calculator",
    siteName: "Moneyva",
    locale: "en_IN",
    type: "website",
  },
};

export default function SalaryHikeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
