"use client";

import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";

const content = {
  en: {
    eyebrow: "ABOUT MONEYVA",
    title: "Your Money. Simplified.",
    intro:
      "Moneyva is a financial calculator platform designed to make everyday money calculations easier to understand. Our goal is to help you explore your numbers, compare scenarios, and plan with greater clarity.",
    missionTitle: "Why Moneyva exists",
    mission:
      "Financial decisions often begin with simple questions: What will my in-hand salary be? How much has my salary increased? What could a regular monthly investment grow to under different assumptions? Moneyva brings useful calculators together so you can explore these questions in one place.",
    toolsTitle: "Tools to make calculations simpler",
    toolsIntro:
      "Moneyva offers practical calculators for common personal-finance questions, with more tools planned over time.",
    tools: [
      {
        title: "CTC to In-Hand Salary Calculator",
        body: "Explore an estimated take-home salary based on your salary structure and the details you enter.",
        href: "/ctc-calculator",
        link: "Use calculator",
      },
      {
        title: "Salary Hike Calculator",
        body: "Compare salary changes using your previous and new CTC or a hike percentage.",
        href: "/salary-hike-calculator",
        link: "Calculate salary hike",
      },
      {
        title: "SIP Calculator",
        body: "Explore illustrative investment projections using a monthly contribution, duration, and assumed return.",
        href: "/sip-calculator",
        link: "Explore SIP calculator",
      },
    ],
    principlesTitle: "What you can expect",
    principles: [
      {
        title: "Clarity",
        body: "Straightforward tools designed to make calculations easier to follow.",
      },
      {
        title: "Useful estimates",
        body: "Results based on the inputs and assumptions used by each calculator, not guaranteed outcomes.",
      },
      {
        title: "Informed decisions",
        body: "A starting point for understanding your numbers—not a substitute for qualified financial, tax, or investment advice.",
      },
    ],
    disclaimer:
      "Calculator results are estimates and may differ from actual outcomes. Investment projections are illustrative and returns are not guaranteed. Verify important financial or tax decisions with an appropriately qualified professional.",
    explore: "Explore our calculators",
    contactTitle: "Have a question or suggestion?",
    contactText:
      "We welcome feedback that helps us make Moneyva more useful.",
    contact: "Contact Us",
    privacy: "Privacy Policy",
    back: "Back to Home",
  },
  hi: {
    eyebrow: "MONEYVA के बारे में",
    title: "आपका पैसा। आसान तरीके से।",
    intro:
      "Moneyva एक वित्तीय कैलकुलेटर प्लेटफ़ॉर्म है, जिसका उद्देश्य रोज़मर्रा की पैसों से जुड़ी गणनाओं को समझना आसान बनाना है। हमारा लक्ष्य आपको अपने आँकड़ों को समझने, अलग-अलग स्थितियों की तुलना करने और बेहतर स्पष्टता के साथ योजना बनाने में मदद करना है।",
    missionTitle: "Moneyva क्यों बनाया गया",
    mission:
      "वित्तीय फैसलों की शुरुआत अक्सर आसान सवालों से होती है: इन-हैंड सैलरी कितनी होगी? सैलरी में कितनी बढ़ोतरी हुई? अलग-अलग अनुमानित रिटर्न के आधार पर नियमित मासिक निवेश कितना हो सकता है? Moneyva ऐसे सवालों को समझने के लिए उपयोगी कैलकुलेटर एक जगह उपलब्ध कराता है।",
    toolsTitle: "गणनाओं को आसान बनाने वाले टूल",
    toolsIntro:
      "Moneyva व्यक्तिगत वित्त से जुड़े सामान्य सवालों के लिए उपयोगी कैलकुलेटर देता है। समय के साथ और टूल जोड़े जा सकते हैं।",
    tools: [
      {
        title: "CTC से इन-हैंड सैलरी कैलकुलेटर",
        body: "आपके सैलरी स्ट्रक्चर और दर्ज की गई जानकारी के आधार पर अनुमानित इन-हैंड सैलरी देखें।",
        href: "/ctc-calculator",
        link: "कैलकुलेटर इस्तेमाल करें",
      },
      {
        title: "सैलरी हाइक कैलकुलेटर",
        body: "पुराने और नए CTC या हाइक प्रतिशत के आधार पर सैलरी में बदलाव की तुलना करें।",
        href: "/salary-hike-calculator",
        link: "सैलरी हाइक निकालें",
      },
      {
        title: "SIP कैलकुलेटर",
        body: "मासिक निवेश, अवधि और अनुमानित रिटर्न के आधार पर संभावित निवेश परिणाम देखें।",
        href: "/sip-calculator",
        link: "SIP कैलकुलेटर देखें",
      },
    ],
    principlesTitle: "आप हमसे क्या उम्मीद कर सकते हैं",
    principles: [
      {
        title: "स्पष्टता",
        body: "ऐसे सरल टूल जिनसे गणनाओं को समझना आसान हो।",
      },
      {
        title: "उपयोगी अनुमान",
        body: "परिणाम कैलकुलेटर में दर्ज जानकारी और उसकी मान्यताओं पर आधारित होते हैं, गारंटी नहीं।",
      },
      {
        title: "जानकारी के आधार पर निर्णय",
        body: "अपने आँकड़ों को समझने की शुरुआत—यह योग्य वित्तीय, टैक्स या निवेश सलाह का विकल्प नहीं है।",
      },
    ],
    disclaimer:
      "कैलकुलेटर के परिणाम अनुमान हैं और वास्तविक परिणाम अलग हो सकते हैं। निवेश के अनुमान केवल उदाहरण हैं और रिटर्न की गारंटी नहीं है। महत्वपूर्ण वित्तीय या टैक्स निर्णयों की पुष्टि योग्य विशेषज्ञ से करें।",
    explore: "कैलकुलेटर देखें",
    contactTitle: "कोई सवाल या सुझाव है?",
    contactText:
      "Moneyva को और उपयोगी बनाने वाले सुझावों का हम स्वागत करते हैं।",
    contact: "संपर्क करें",
    privacy: "प्राइवेसी पॉलिसी",
    back: "होम पेज पर वापस जाएँ",
  },
} as const;

export default function AboutPage() {
  const { language } = usePreferences();
  const t = content[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111F] dark:text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
        >
          ← {t.back}
        </Link>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-12">
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {t.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#calculators"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 font-bold text-[#07111F] transition hover:bg-emerald-300"
            >
              {t.explore}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-bold transition hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/5"
            >
              {t.contact}
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6 dark:border-white/10 sm:p-8">
            <h2 className="text-2xl font-bold">{t.missionTitle}</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              {t.mission}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6 dark:border-white/10 sm:p-8">
            <h2 className="text-2xl font-bold">{t.principlesTitle}</h2>
            <div className="mt-5 space-y-5">
              {t.principles.map((item) => (
                <div key={item.title}>
                  <h3 className="font-bold text-emerald-700 dark:text-emerald-300">
                    {item.title}
                  </h3>
                  <p className="mt-1 leading-7 text-slate-600 dark:text-slate-300">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-extrabold">{t.toolsTitle}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
            {t.toolsIntro}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {t.tools.map((tool) => (
              <article
                key={tool.href}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <h3 className="text-lg font-bold">{tool.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600 dark:text-slate-300">
                  {tool.body}
                </p>
                <Link
                  href={tool.href}
                  className="mt-5 font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
                >
                  {tool.link} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
          {t.disclaimer}
        </p>

        <section className="mt-10 rounded-2xl bg-slate-100 p-6 dark:bg-white/5 sm:p-8">
          <h2 className="text-2xl font-bold">{t.contactTitle}</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            {t.contactText}
          </p>
          <div className="mt-5 flex flex-wrap gap-5">
            <Link
              href="/contact"
              className="font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
            >
              {t.contact} →
            </Link>
            <Link
              href="/privacy"
              className="font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
            >
              {t.privacy} →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
