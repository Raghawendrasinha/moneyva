"use client";

import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";

export default function MoneyvaFooter() {
  const { language } = usePreferences();
  const isHindi = language === "hi";

  const text = {
    description: isHindi
      ? "आपका पैसा। आसान तरीके से। ऐसे वित्तीय कैलकुलेटर जो आपको अपने पैसे को समझने और बेहतर तरीके से प्लान करने में मदद करते हैं।"
      : "Your Money. Simplified. Practical financial calculators designed to help you understand and plan your money better.",
    tools: isHindi ? "टूल्स" : "Tools",
    ctc: isHindi ? "CTC से इन-हैंड" : "CTC to In-Hand",
    salaryHike: isHindi ? "सैलरी हाइक कैलकुलेटर" : "Salary Hike Calculator",
    sip: isHindi ? "SIP कैलकुलेटर" : "SIP Calculator",
    incomeTax: isHindi ? "इनकम टैक्स कैलकुलेटर" : "Income Tax Calculator",
    epf: isHindi ? "EPF कैलकुलेटर" : "EPF Calculator",
    moneyva: "Moneyva",
    howItWorks: isHindi ? "यह कैसे काम करता है" : "How It Works",
    about: isHindi ? "हमारे बारे में" : "About",
    privacy: isHindi ? "प्राइवेसी" : "Privacy",
    contact: isHindi ? "संपर्क करें" : "Contact Us",
    disclaimer: isHindi ? "डिस्क्लेमर" : "Disclaimer",
    rights: isHindi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved.",
  };

  const linkClass =
    "block text-sm text-slate-500 transition hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400";

  const comingSoonClass = "block text-sm text-slate-400";

  return (
    <footer className="border-t border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-[#050D17]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-extrabold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400 text-lg font-black text-[#07111F]">
                ₹
              </span>
              Moneyva
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              {text.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">{text.tools}</h3>
            <div className="mt-4 space-y-3">
              <Link href="/ctc-calculator" className={linkClass}>
                {text.ctc}
              </Link>
              <Link href="/salary-hike-calculator" className={linkClass}>
                {text.salaryHike}
              </Link>
              <Link href="/sip-calculator" className={linkClass}>
                {text.sip}
              </Link>
              <span className={comingSoonClass}>{text.incomeTax}</span>
              <span className={comingSoonClass}>{text.epf}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">{text.moneyva}</h3>
            <div className="mt-4 space-y-3">
              <Link href="/#how-it-works" className={linkClass}>
                {text.howItWorks}
              </Link>
              <span className={comingSoonClass}>{text.about}</span>
              <Link href="/privacy" className={linkClass}>{text.privacy}</Link>
              <Link href="/disclaimer" className={linkClass}>
                {text.disclaimer}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-[#07111F] transition hover:bg-emerald-300"
              >
                {text.contact}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          © {new Date().getFullYear()} Moneyva. {text.rights}
        </div>
      </div>
    </footer>
  );
}
