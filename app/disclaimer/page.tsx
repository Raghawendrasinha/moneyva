"use client";

import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";

const content = {
  en: {
    eyebrow: "IMPORTANT INFORMATION",
    title: "Disclaimer",
    updated: "Last updated: 17 October 2026",
    intro:
      "Welcome to Moneyva. This website provides financial calculators, estimates and educational information. By using Moneyva, you acknowledge the following terms.",
    sections: [
      {
        title: "1. General Information",
        body: "Moneyva provides online financial calculators, estimates and planning tools for informational and educational purposes only. We aim to provide useful and accurate results, but we cannot guarantee that all information or calculations will always be complete, accurate or up to date.",
      },
      {
        title: "2. Salary, Tax and CTC Calculations",
        body: "Salary, CTC, in-hand salary, salary hike, income tax, EPF, gratuity and related calculations are estimates based on the details entered by you and the assumptions used by each calculator. Actual results may vary depending on your salary structure, employer policies, applicable tax regime, deductions, exemptions, current laws and individual circumstances. Verify important calculations with your employer, payroll department, chartered accountant or qualified tax professional.",
      },
      {
        title: "3. SIP and Mutual Fund Investments",
        body: "SIP calculator results are mathematical illustrations based on your monthly investment, assumed annual return, investment duration and selected annual step-up. Projected returns are not guaranteed and do not predict future market performance. Actual returns may be lower than estimated or negative. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.",
      },
      {
        title: "4. No Financial or Investment Advice",
        body: "Information on Moneyva does not constitute personalized financial, investment, tax, legal or accounting advice, or a recommendation to buy, sell or hold any financial product. Consider your own financial circumstances and consult a suitably qualified professional before making significant financial decisions.",
      },
      {
        title: "5. Accuracy and Limitation of Liability",
        body: "We make reasonable efforts to maintain the website and its calculators. However, we do not warrant that the website, calculations or information will be error-free, uninterrupted or suitable for every user's circumstances. To the extent permitted by applicable law, Moneyva is not liable for losses arising from reliance on calculator results or website information. Nothing in this disclaimer excludes liability that cannot legally be excluded.",
      },
      {
        title: "6. External Websites and Third-Party Information",
        body: "Moneyva may link to external websites or reference third-party information. We do not control and are not responsible for the accuracy, availability, policies or content of those external resources.",
      },
      {
        title: "7. Your Responsibility",
        body: "You are responsible for verifying calculator results and evaluating decisions made using Moneyva. Do not rely solely on an estimate for tax filing, investing, borrowing or other consequential financial decisions.",
      },
      {
        title: "8. Changes to This Disclaimer",
        body: "We may update this disclaimer from time to time. Any revised version will be published on this page with an updated revision date.",
      },
      {
        title: "9. Contact",
        body: "For questions regarding this disclaimer, please use the contact details published on the Moneyva website.",
      },
    ],
    back: "Back to Home",
  },
  hi: {
    eyebrow: "महत्वपूर्ण जानकारी",
    title: "डिस्क्लेमर",
    updated: "अंतिम अपडेट: 17 अक्टूबर 2026",
    intro:
      "Moneyva में आपका स्वागत है। यह वेबसाइट वित्तीय कैलकुलेटर, अनुमान और शैक्षणिक जानकारी प्रदान करती है। Moneyva का उपयोग करके आप नीचे दी गई शर्तों को स्वीकार करते हैं।",
    sections: [
      {
        title: "1. सामान्य जानकारी",
        body: "Moneyva के ऑनलाइन वित्तीय कैलकुलेटर, अनुमान और प्लानिंग टूल केवल जानकारी और शिक्षा के उद्देश्य से उपलब्ध हैं। हम उपयोगी और सटीक परिणाम देने का प्रयास करते हैं, लेकिन सभी जानकारी या गणनाओं के हमेशा पूर्ण, सटीक या अपडेट रहने की गारंटी नहीं देते।",
      },
      {
        title: "2. सैलरी, टैक्स और CTC की गणना",
        body: "सैलरी, CTC, इन-हैंड सैलरी, सैलरी हाइक, इनकम टैक्स, EPF, ग्रेच्युटी और अन्य गणनाएँ आपके द्वारा दी गई जानकारी और कैलकुलेटर की मान्यताओं पर आधारित अनुमान हैं। वास्तविक परिणाम सैलरी स्ट्रक्चर, नियोक्ता की नीतियों, टैक्स व्यवस्था, कटौतियों, छूट, लागू कानूनों और आपकी व्यक्तिगत परिस्थितियों के अनुसार अलग हो सकते हैं। महत्वपूर्ण गणनाओं की पुष्टि अपने नियोक्ता, पेरोल विभाग, चार्टर्ड अकाउंटेंट या योग्य टैक्स विशेषज्ञ से करें।",
      },
      {
        title: "3. SIP और म्यूचुअल फंड निवेश",
        body: "SIP कैलकुलेटर के परिणाम आपके मासिक निवेश, अनुमानित वार्षिक रिटर्न, निवेश अवधि और चुने गए वार्षिक स्टेप-अप पर आधारित गणितीय अनुमान हैं। अनुमानित रिटर्न की गारंटी नहीं है और ये भविष्य के बाजार प्रदर्शन की भविष्यवाणी नहीं करते। वास्तविक रिटर्न अनुमान से कम या नकारात्मक भी हो सकता है। म्यूचुअल फंड निवेश बाजार जोखिमों के अधीन हैं। निवेश करने से पहले योजना से जुड़े सभी दस्तावेज ध्यान से पढ़ें।",
      },
      {
        title: "4. वित्तीय या निवेश सलाह नहीं",
        body: "Moneyva पर दी गई जानकारी व्यक्तिगत वित्तीय, निवेश, टैक्स, कानूनी या अकाउंटिंग सलाह नहीं है। यह किसी वित्तीय उत्पाद को खरीदने, बेचने या अपने पास रखने की सिफारिश भी नहीं है। महत्वपूर्ण वित्तीय निर्णय लेने से पहले अपनी परिस्थितियों का आकलन करें और योग्य विशेषज्ञ से सलाह लें।",
      },
      {
        title: "5. सटीकता और दायित्व की सीमा",
        body: "हम वेबसाइट और कैलकुलेटर को बनाए रखने का उचित प्रयास करते हैं, लेकिन त्रुटि-मुक्त, निर्बाध या हर उपयोगकर्ता के लिए उपयुक्त होने की गारंटी नहीं देते। लागू कानून द्वारा अनुमत सीमा तक, Moneyva कैलकुलेटर के परिणामों या वेबसाइट की जानकारी पर निर्भरता से होने वाले नुकसान के लिए उत्तरदायी नहीं है। यह डिस्क्लेमर ऐसे किसी दायित्व को बाहर नहीं करता जिसे कानूनन बाहर नहीं किया जा सकता।",
      },
      {
        title: "6. बाहरी वेबसाइट और तीसरे पक्ष की जानकारी",
        body: "Moneyva बाहरी वेबसाइटों के लिंक या तीसरे पक्ष की जानकारी दे सकता है। उन संसाधनों की सटीकता, उपलब्धता, नीतियों या सामग्री पर हमारा नियंत्रण नहीं है और हम उनके लिए जिम्मेदार नहीं हैं।",
      },
      {
        title: "7. आपकी जिम्मेदारी",
        body: "Moneyva के परिणामों की पुष्टि करना और उनके आधार पर लिए गए निर्णयों का मूल्यांकन करना आपकी जिम्मेदारी है। टैक्स फाइलिंग, निवेश, उधार या अन्य महत्वपूर्ण वित्तीय निर्णयों के लिए केवल अनुमान पर निर्भर न रहें।",
      },
      {
        title: "8. डिस्क्लेमर में बदलाव",
        body: "हम समय-समय पर इस डिस्क्लेमर को अपडेट कर सकते हैं। संशोधित संस्करण इस पेज पर अपडेट की गई तारीख के साथ प्रकाशित किया जाएगा।",
      },
      {
        title: "9. संपर्क",
        body: "इस डिस्क्लेमर से जुड़े प्रश्नों के लिए Moneyva वेबसाइट पर प्रकाशित संपर्क विवरण का उपयोग करें।",
      },
    ],
    back: "होम पेज पर वापस जाएँ",
  },
} as const;

export default function DisclaimerPage() {
  const { language } = usePreferences();
  const t = content[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111F] dark:text-white">
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
        >
          ← {t.back}
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8 dark:border-white/10">
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.updated}
          </p>
          <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
            {t.intro}
          </p>
        </header>

        <div className="divide-y divide-slate-200 dark:divide-white/10">
          {t.sections.map((section) => (
            <section key={section.title} className="py-7">
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
          {language === "hi"
            ? "यह सामान्य जानकारी है, कानूनी सलाह नहीं। प्रकाशित करने से पहले अपनी वास्तविक सेवाओं और लागू भारतीय कानूनों के अनुसार इसकी समीक्षा करवाएँ।"
            : "This is general information, not legal advice. Have this disclaimer reviewed against your actual services and applicable Indian laws before publication."}
        </p>
      </article>
    </main>
  );
}
