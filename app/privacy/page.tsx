"use client";

import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";

const content = {
  en: {
    eyebrow: "YOUR PRIVACY MATTERS",
    title: "Privacy Policy",
    updated: "Last updated: 18 October 2026",
    intro:
      "This Privacy Policy explains how Moneyva collects, uses, and handles information when you visit our website or use our financial calculators and contact services. Please read it carefully.",
    sections: [
      {
        title: "1. Information We Collect",
        body:
          "If you contact Moneyva, we may collect your name, email address, message, and information needed to manage your support request. We also process information you enter into our calculators to provide the requested calculations. Please do not submit passwords, bank account details, government identification numbers, or other sensitive information through our website.",
      },
      {
        title: "2. How We Use Information",
        body:
          "We use submitted contact information to respond to enquiries, register and manage support tickets, send ticket acknowledgements or replies, maintain website security, prevent spam and abuse, and operate and improve Moneyva. Calculator inputs are used to produce the results you request. We do not claim that calculator inputs are never processed or stored by technical systems; avoid entering information that is not needed for a calculation.",
      },
      {
        title: "3. Contact Forms and Support Tickets",
        body:
          "When you submit our contact form, your name, email address, message, ticket number, ticket status, and related support information may be stored in our database. We use email services to send your enquiry to our support destination and, where available, to send you acknowledgements or replies. A ticket-tracking link may contain a security token used to access the relevant ticket. Keep that link private.",
      },
      {
        title: "4. Service Providers",
        body:
          "Moneyva uses third-party services to operate parts of the website and support process. These currently include Supabase for support-ticket data, Resend for email delivery, and Upstash Redis for contact-form rate limiting. Website hosting and deployment are provided through our hosting platform. These providers may process relevant information on our behalf to deliver their services and are subject to their own terms and privacy policies.",
      },
      {
        title: "5. Cookies, Local Storage and Preferences",
        body:
          "Moneyva uses browser local storage to remember your theme and language preferences. These settings help the website remember your chosen appearance and language on future visits. Your browser controls whether local storage is retained; clearing your browser's site data may reset these preferences. Hosting, security, or third-party services may use additional technical mechanisms depending on their configuration.",
      },
      {
        title: "6. Analytics and Advertising",
        body:
          "We do not describe any analytics or advertising technology here as active unless it has been configured on the website. If Moneyva introduces analytics, advertising, or other tracking services, this policy should be updated to identify those services and explain the relevant data practices.",
      },
      {
        title: "7. Data Sharing",
        body:
          "We do not sell your contact-form information. We may share information with service providers when needed to operate the website, deliver emails, manage support requests, protect the service, comply with applicable law, or respond to lawful requests. We do not use this policy to promise that information is never processed by third parties.",
      },
      {
        title: "8. Data Retention and Security",
        body:
          "We retain support information for as long as reasonably necessary to handle enquiries, maintain records, address disputes, protect the service, or meet applicable legal obligations. A fixed retention period has not been specified in this policy. We use reasonable measures intended to protect information, but no website, transmission method, or storage system can be guaranteed to be completely secure.",
      },
      {
        title: "9. Your Choices and Privacy Requests",
        body:
          "You can choose not to submit the contact form, and you can clear browser local storage to remove saved preferences. If you want to ask about, correct, or request deletion of personal information you submitted to Moneyva, contact us through our Contact Us page. We may need to verify your request and may retain certain information where required or permitted by law.",
      },
      {
        title: "10. Children's Privacy",
        body:
          "Moneyva is a general-purpose financial calculator website and is not intended to solicit personal information from children. If you believe a child has submitted personal information to us, please contact us so we can review the request and take appropriate action where required.",
      },
      {
        title: "11. External Links",
        body:
          "Our website may link to third-party websites. We do not control their content, security, or privacy practices. Review the privacy policy of any external website you visit.",
      },
      {
        title: "12. Changes to This Policy",
        body:
          "We may update this Privacy Policy as Moneyva's features, service providers, or legal obligations change. The latest version will be published on this page with a revised update date.",
      },
      {
        title: "13. Contact Moneyva",
        body:
          "For privacy-related questions or requests, please contact us through our Contact Us page. Include enough information for us to understand your request, but do not send passwords or other sensitive credentials.",
      },
    ],
    contact: "Contact Us",
    back: "Back to Home",
    note:
      "This policy describes the practices currently identified in the Moneyva application. Review it against the live production configuration and applicable law before relying on it as a legal document.",
  },
  hi: {
    eyebrow: "आपकी गोपनीयता महत्वपूर्ण है",
    title: "प्राइवेसी पॉलिसी",
    updated: "अंतिम अपडेट: 18 अक्टूबर 2026",
    intro:
      "यह प्राइवेसी पॉलिसी बताती है कि Moneyva वेबसाइट देखने, वित्तीय कैलकुलेटर इस्तेमाल करने या हमसे संपर्क करने पर जानकारी कैसे एकत्र और उपयोग करता है। कृपया इसे ध्यान से पढ़ें।",
    sections: [
      {
        title: "1. हम कौन-सी जानकारी एकत्र करते हैं",
        body:
          "Moneyva से संपर्क करने पर आपका नाम, ईमेल पता, संदेश और सहायता अनुरोध से जुड़ी जानकारी ली जा सकती है। कैलकुलेटर में आपके द्वारा दर्ज की गई जानकारी का उपयोग अनुरोधित गणना करने के लिए किया जाता है। वेबसाइट पर पासवर्ड, बैंक खाते का विवरण, सरकारी पहचान संख्या या अन्य संवेदनशील जानकारी न भेजें।",
      },
      {
        title: "2. जानकारी का उपयोग",
        body:
          "हम संपर्क जानकारी का उपयोग प्रश्नों का उत्तर देने, सहायता टिकट दर्ज करने और संभालने, ईमेल भेजने, वेबसाइट की सुरक्षा बनाए रखने, स्पैम और दुरुपयोग रोकने तथा Moneyva को चलाने और बेहतर बनाने के लिए करते हैं। कैलकुलेटर में दर्ज जानकारी से अनुरोधित परिणाम तैयार किए जाते हैं। हम यह दावा नहीं करते कि कैलकुलेटर की जानकारी कभी किसी तकनीकी प्रणाली द्वारा संसाधित या संग्रहीत नहीं होती।",
      },
      {
        title: "3. संपर्क फ़ॉर्म और सहायता टिकट",
        body:
          "संपर्क फ़ॉर्म भेजने पर आपका नाम, ईमेल, संदेश, टिकट नंबर, टिकट स्टेटस और संबंधित सहायता जानकारी डेटाबेस में संग्रहीत हो सकती है। ईमेल सेवाओं का उपयोग संदेश सहायता टीम तक पहुँचाने और उपलब्ध होने पर पुष्टि या जवाब भेजने के लिए किया जाता है। टिकट ट्रैकिंग लिंक में सुरक्षा टोकन हो सकता है। इस लिंक को निजी रखें।",
      },
      {
        title: "4. सेवा प्रदाता",
        body:
          "वेबसाइट और सहायता सेवाओं के कुछ हिस्सों के लिए Moneyva तीसरे पक्ष की सेवाओं का उपयोग करता है। इनमें सहायता टिकट डेटा के लिए Supabase, ईमेल भेजने के लिए Resend और संपर्क फ़ॉर्म की दर-सीमा नियंत्रित करने के लिए Upstash Redis शामिल हैं। वेबसाइट की होस्टिंग और डिप्लॉयमेंट के लिए भी होस्टिंग सेवा का उपयोग होता है। ये प्रदाता अपनी सेवाएँ देने के लिए संबंधित जानकारी संसाधित कर सकते हैं और उनकी अपनी शर्तें व प्राइवेसी पॉलिसी लागू होती हैं।",
      },
      {
        title: "5. कुकीज़, लोकल स्टोरेज और प्राथमिकताएँ",
        body:
          "Moneyva ब्राउज़र के लोकल स्टोरेज में आपकी थीम और भाषा की पसंद याद रखता है। इससे अगली बार वेबसाइट खोलने पर चुनी गई थीम और भाषा याद रह सकती है। ब्राउज़र का साइट डेटा हटाने पर ये प्राथमिकताएँ रीसेट हो सकती हैं। कॉन्फ़िगरेशन के आधार पर होस्टिंग, सुरक्षा या तीसरे पक्ष की सेवाएँ अन्य तकनीकी तरीकों का भी उपयोग कर सकती हैं।",
      },
      {
        title: "6. एनालिटिक्स और विज्ञापन",
        body:
          "जब तक वेबसाइट पर कोई एनालिटिक्स या विज्ञापन सेवा सक्रिय रूप से कॉन्फ़िगर न हो, हम उसे सक्रिय होने का दावा नहीं करते। भविष्य में ऐसी सेवाएँ जोड़ी जाती हैं, तो संबंधित डेटा प्रथाओं के साथ इस पॉलिसी को अपडेट किया जाना चाहिए।",
      },
      {
        title: "7. जानकारी साझा करना",
        body:
          "हम आपकी संपर्क फ़ॉर्म की जानकारी बेचते नहीं हैं। वेबसाइट चलाने, ईमेल भेजने, सहायता अनुरोध संभालने, सेवा की सुरक्षा, लागू कानून का पालन या वैध अनुरोधों का जवाब देने के लिए सेवा प्रदाताओं के साथ आवश्यक जानकारी साझा की जा सकती है।",
      },
      {
        title: "8. डेटा रखने की अवधि और सुरक्षा",
        body:
          "सहायता से जुड़ी जानकारी को प्रश्नों का उत्तर देने, रिकॉर्ड रखने, विवाद सुलझाने, सेवा की सुरक्षा या कानूनी दायित्वों के लिए आवश्यक अवधि तक रखा जा सकता है। इस पॉलिसी में कोई निश्चित अवधि निर्धारित नहीं की गई है। जानकारी की सुरक्षा के लिए उचित उपाय किए जाते हैं, लेकिन किसी भी वेबसाइट या स्टोरेज सिस्टम की पूर्ण सुरक्षा की गारंटी नहीं दी जा सकती।",
      },
      {
        title: "9. आपके विकल्प और प्राइवेसी अनुरोध",
        body:
          "आप संपर्क फ़ॉर्म न भेजने का विकल्प चुन सकते हैं और ब्राउज़र का लोकल स्टोरेज हटाकर सहेजी गई प्राथमिकताएँ मिटा सकते हैं। Moneyva को दी गई व्यक्तिगत जानकारी के बारे में पूछने, उसे ठीक कराने या हटाने का अनुरोध करने के लिए Contact Us पेज से संपर्क करें। अनुरोध की पुष्टि आवश्यक हो सकती है और कानून के अनुसार कुछ जानकारी रखी जा सकती है।",
      },
      {
        title: "10. बच्चों की गोपनीयता",
        body:
          "Moneyva सामान्य वित्तीय कैलकुलेटर वेबसाइट है और इसका उद्देश्य बच्चों से व्यक्तिगत जानकारी लेना नहीं है। यदि आपको लगता है कि किसी बच्चे ने हमें व्यक्तिगत जानकारी भेजी है, तो कृपया संपर्क करें ताकि अनुरोध की समीक्षा की जा सके।",
      },
      {
        title: "11. बाहरी लिंक",
        body:
          "वेबसाइट पर तीसरे पक्ष की वेबसाइटों के लिंक हो सकते हैं। उनकी सामग्री, सुरक्षा या प्राइवेसी प्रथाओं पर हमारा नियंत्रण नहीं है। ऐसी वेबसाइट खोलने से पहले उनकी प्राइवेसी पॉलिसी पढ़ें।",
      },
      {
        title: "12. इस पॉलिसी में बदलाव",
        body:
          "Moneyva की सुविधाओं, सेवा प्रदाताओं या कानूनी आवश्यकताओं में बदलाव होने पर हम इस प्राइवेसी पॉलिसी को अपडेट कर सकते हैं। नया संस्करण अपडेट की तारीख के साथ इसी पेज पर प्रकाशित किया जाएगा।",
      },
      {
        title: "13. Moneyva से संपर्क",
        body:
          "प्राइवेसी से जुड़े सवालों या अनुरोधों के लिए Contact Us पेज से संपर्क करें। अनुरोध समझने के लिए आवश्यक जानकारी दें, लेकिन पासवर्ड या अन्य संवेदनशील जानकारी न भेजें।",
      },
    ],
    contact: "संपर्क करें",
    back: "होम पेज पर वापस जाएँ",
    note:
      "यह पॉलिसी Moneyva एप्लिकेशन में पहचानी गई प्रथाओं का वर्णन करती है। कानूनी दस्तावेज़ के रूप में उपयोग करने से पहले लाइव कॉन्फ़िगरेशन और लागू कानूनों के अनुसार इसकी समीक्षा करें।",
  },
} as const;

export default function PrivacyPage() {
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

        <Link
          href="/contact"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 font-bold text-[#07111F] transition hover:bg-emerald-300"
        >
          {t.contact}
        </Link>

        <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
          {t.note}
        </p>
      </article>
    </main>
  );
}
