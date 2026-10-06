import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Hike Calculator – Calculate New CTC & Hike %",
  description:
    "Calculate your salary hike percentage, hike amount and new CTC in India. Enter either your expected hike percentage or new CTC with Moneyva.",
  alternates: {
    canonical: "https://www.moneyva.in/salary-hike-calculator",
  },
  openGraph: {
    title: "Salary Hike Calculator – New CTC & Hike % | Moneyva",
    description:
      "Calculate salary hike percentage, hike amount and new CTC easily with Moneyva.",
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
