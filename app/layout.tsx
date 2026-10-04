import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import MoneyvaHeader from "@/components/MoneyvaHeader";

export const metadata: Metadata = {
  title: "Moneyva",
  description:
    "Smart financial calculators for India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PreferencesProvider>
          <MoneyvaHeader />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}