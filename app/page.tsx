"use client";

import Link from "next/link";
import { usePreferences } from "@/components/PreferencesProvider";
import { translations } from "@/lib/i18n/translations";

export default function Home() {
  const { language } = usePreferences();

  const t = translations[language].home;

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-slate-50
        text-slate-900
        transition-colors
        duration-300
        dark:bg-[#07111F]
        dark:text-white
      "
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">
        {/* Background effects */}

        <div
          className="
            pointer-events-none
            absolute
            -left-48
            -top-48
            h-[500px]
            w-[500px]
            rounded-full
            bg-emerald-400/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-48
            top-24
            h-[600px]
            w-[600px]
            rounded-full
            bg-emerald-300/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[300px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-400/[0.03]
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            grid
            max-w-7xl
            gap-14
            px-5
            pb-20
            pt-14
            sm:px-8
            sm:pb-24
            sm:pt-20
            lg:grid-cols-[1.05fr_0.95fr]
            lg:items-center
            lg:gap-16
            lg:pb-28
            lg:pt-24
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div>
            {/* Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-500/20
                bg-emerald-500/10
                px-4
                py-2
                text-sm
                font-semibold
                text-emerald-600
                dark:text-emerald-300
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,0.7)]
                "
              />

              {t.badge}
            </div>

            {/* Heading */}

            <h1
              className="
                mt-7
                max-w-3xl
                text-5xl
                font-black
                leading-[0.98]
                tracking-[-0.04em]
                text-slate-950
                sm:text-6xl
                lg:text-7xl
                dark:text-white
              "
            >
              {t.heroTitle}

              <span
                className="
                  mt-1
                  block
                  text-emerald-500
                  dark:text-emerald-400
                "
              >
                {t.heroAccent}
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-7
                max-w-xl
                text-lg
                leading-8
                text-slate-600
                sm:text-xl
                dark:text-slate-400
              "
            >
              {t.heroDescription}
            </p>

            {/* CTA */}

            <div
              className="
                mt-9
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <Link
                href="/ctc-calculator"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-emerald-400
                  px-7
                  py-4
                  text-base
                  font-bold
                  text-[#07111F]
                  shadow-xl
                  shadow-emerald-500/10
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-emerald-300
                  hover:shadow-emerald-500/20
                "
              >
                {t.calculateTakeHome}

                <span
                  className="
                    transition
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>

              <a
                href="#calculators"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-7
                  py-4
                  text-base
                  font-semibold
                  text-slate-800
                  transition
                  hover:border-slate-400
                  hover:bg-slate-100
                  dark:border-white/15
                  dark:bg-white/[0.04]
                  dark:text-white
                  dark:hover:bg-white/[0.08]
                "
              >
                {t.exploreCalculators}
              </a>
            </div>

            {/* Trust points */}

            <div
              className="
                mt-9
                flex
                flex-wrap
                gap-x-7
                gap-y-3
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              <TrustPoint text={t.indiaFocused} />
              <TrustPoint text={t.epfAware} />
              <TrustPoint text={t.freeToUse} />
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — PRODUCT PREVIEW
          ================================================== */}

          <div className="relative">
            {/* Outer glow */}

            <div
              className="
                absolute
                -inset-6
                rounded-[2.5rem]
                bg-emerald-400/[0.07]
                blur-3xl
              "
            />

            {/* Main card */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-slate-200
                bg-white
                shadow-2xl
                shadow-slate-300/30
                dark:border-white/10
                dark:bg-[#0D1B2A]
                dark:shadow-black/30
              "
            >
              {/* Browser-like top */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-200
                  px-5
                  py-4
                  dark:border-white/10
                "
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>

                <div
                  className="
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  Moneyva
                </div>

                <div className="w-10" />
              </div>

              {/* Card header */}

              <div
                className="
                  border-b
                  border-slate-200
                  px-6
                  py-5
                  sm:px-7
                  dark:border-white/10
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        text-slate-500
                      "
                    >
                      {t.ctcToInHand}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-extrabold
                      "
                    >
                      {t.salaryCalculator}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-400/10
                      text-xl
                      font-black
                      text-emerald-500
                      dark:text-emerald-400
                    "
                  >
                    ₹
                  </div>
                </div>
              </div>

              {/* Card body */}

              <div className="p-6 sm:p-7">
                {/* CTC */}

                <div
                  className="
                    rounded-2xl
                    bg-slate-100
                    p-5
                    dark:bg-[#07111F]
                  "
                >
                  <p
                    className="
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    {t.exampleAnnualCtc}
                  </p>

                  <p
                    className="
                      mt-2
                      text-3xl
                      font-black
                      tracking-tight
                    "
                  >
                    ₹15,00,000
                  </p>
                </div>

                {/* Metrics */}

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <MiniMetric label={t.monthlyTakeHome} value="₹1,03,258" />

                  <MiniMetric label={t.annualTakeHome} value="₹13.33L" />
                </div>

                {/* Tax */}

                <div
                  className="
                    mt-3
                    rounded-2xl
                    border
                    border-emerald-500/10
                    bg-emerald-500/5
                    p-4
                  "
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {t.totalTax}
                    </span>

                    <span
                      className="
                        font-bold
                        text-emerald-500
                        dark:text-emerald-300
                      "
                    >
                      ₹91,281
                    </span>
                  </div>
                </div>

                {/* CTA */}

                <Link
                  href="/ctc-calculator"
                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-400
                    py-3.5
                    font-bold
                    text-[#07111F]
                    transition
                    hover:bg-emerald-300
                  "
                >
                  {t.tryCalculator}
                </Link>
              </div>
            </div>

            {/* Floating card */}

            <div
              className="
                absolute
                -bottom-5
                -left-5
                hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-4
                shadow-xl
                sm:block
                dark:border-white/10
                dark:bg-[#102131]
              "
            >
              <p
                className="
                  text-[11px]
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t.monthlyTakeHome}
              </p>

              <p className="mt-1 text-lg font-black">₹1,03,258</p>

              <div className="mt-1 text-xs font-semibold text-emerald-500">
                ✓ {t.freeToUse}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section
        className="
          border-y
          border-slate-200
          bg-white
          dark:border-white/10
          dark:bg-[#0A1726]
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-2
            divide-x
            divide-y
            divide-slate-200
            sm:grid-cols-4
            sm:divide-y-0
            dark:divide-white/10
          "
        >
          <Stat value="₹" label={t.indiaFocused} />

          <Stat value="EPF" label={t.epfAware} />

          <Stat value="Tax" label={t.totalTax} />

          <Stat value="Free" label={t.freeToUse} />
        </div>
      </section>

      {/* =====================================================
          CALCULATORS
      ====================================================== */}

      <section
        id="calculators"
        className="
          mx-auto
          max-w-7xl
          px-5
          py-20
          sm:px-8
          lg:py-28
        "
      >
        <div
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="max-w-2xl">
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-emerald-500
                dark:text-emerald-400
              "
            >
              {t.toolsLabel}
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-extrabold
                tracking-tight
                sm:text-4xl
              "
            >
              {t.toolsTitle}
            </h2>

            <p
              className="
                mt-4
                leading-7
                text-slate-600
                dark:text-slate-400
              "
            >
              {t.toolsDescription}
            </p>
          </div>

          <Link
            href="/ctc-calculator"
            className="
              hidden
              text-sm
              font-bold
              text-emerald-600
              transition
              hover:text-emerald-500
              lg:block
              dark:text-emerald-400
            "
          >
            {t.tryIt} →
          </Link>
        </div>

        {/* Tool cards */}

        <div
          className="
            mt-10
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <ToolCard
            icon="₹"
            title={t.ctcToInHand}
            description={t.heroDescription}
            href="/ctc-calculator"
            available
            availableText={t.available}
            tryText={t.tryIt}
          />

          <ToolCard
            icon="%"
            title={t.salaryHikeCalculator}
            description={t.salaryHikeDescription}
            href="/salary-hike-calculator"
            available
            availableText={t.available}
            tryText={t.tryIt}
          />

          <ToolCard
            icon="T"
            title={t.incomeTax}
            description={t.incomeTaxDescription}
            availableText={t.comingSoon}
          />

          <ToolCard
            icon="P"
            title={t.epfCalculator}
            description={t.epfDescription}
            availableText={t.comingSoon}
          />

          <ToolCard
            icon="S"
            title={t.sipCalculator}
            description={t.sipDescription}
            availableText={t.comingSoon}
          />

          <ToolCard
            icon="E"
            title={t.emiCalculator}
            description={t.emiDescription}
            availableText={t.comingSoon}
          />

          <ToolCard
            icon="G"
            title={t.gratuityCalculator}
            description={t.gratuityDescription}
            availableText={t.comingSoon}
          />
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="
          border-y
          border-slate-200
          bg-white
          dark:border-white/10
          dark:bg-[#0A1726]
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-20
            sm:px-8
            lg:py-24
          "
        >
          <div className="text-center">
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-emerald-500
                dark:text-emerald-400
              "
            >
              {t.simpleByDesign}
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-extrabold
                sm:text-4xl
              "
            >
              {t.howTitle}
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                leading-7
                text-slate-600
                dark:text-slate-400
              "
            >
              {t.howDescription}
            </p>
          </div>

          <div
            className="
              mt-12
              grid
              gap-5
              md:grid-cols-3
            "
          >
            <Step
              number="01"
              title={t.step1Title}
              description={t.step1Description}
            />

            <Step
              number="02"
              title={t.step2Title}
              description={t.step2Description}
            />

            <Step
              number="03"
              title={t.step3Title}
              description={t.step3Description}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section
        className="
          px-5
          py-20
          sm:px-8
          lg:py-28
        "
      >
        <div
          className="
            relative
            mx-auto
            max-w-5xl
            overflow-hidden
            rounded-[2rem]
            border
            border-emerald-500/20
            bg-gradient-to-br
            from-emerald-50
            via-white
            to-emerald-50
            p-8
            text-center
            sm:p-12
            lg:p-16
            dark:from-[#0D2A2A]
            dark:via-[#0D1B2A]
            dark:to-[#0D2A2A]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-64
              w-64
              -translate-x-1/2
              rounded-full
              bg-emerald-400/10
              blur-3xl
            "
          />

          <div className="relative">
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-emerald-400
                text-2xl
                font-black
                text-[#07111F]
                shadow-lg
                shadow-emerald-500/20
              "
            >
              ₹
            </div>

            <p
              className="
                mt-6
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-emerald-500
                dark:text-emerald-400
              "
            >
              {t.startWithSalary}
            </p>

            <h2
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-3xl
                font-extrabold
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              {t.ctaTitle}
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                leading-7
                text-slate-600
                dark:text-slate-400
              "
            >
              {t.ctaDescription}
            </p>

            <Link
              href="/ctc-calculator"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-emerald-400
                px-7
                py-4
                font-bold
                text-[#07111F]
                shadow-lg
                shadow-emerald-500/10
                transition
                hover:-translate-y-0.5
                hover:bg-emerald-300
              "
            >
              {t.calculateYourSalary}

              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        className="
          border-t
          border-slate-200
          bg-slate-100
          dark:border-white/10
          dark:bg-[#050D17]
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-12
            sm:px-8
          "
        >
          <div
            className="
              grid
              gap-10
              md:grid-cols-4
            "
          >
            {/* Brand */}

            <div className="md:col-span-2">
              <Link
                href="/"
                className="
                  flex
                  items-center
                  gap-3
                  text-2xl
                  font-extrabold
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-400
                    text-lg
                    font-black
                    text-[#07111F]
                  "
                >
                  ₹
                </span>
                Moneyva
              </Link>

              <p
                className="
                  mt-3
                  max-w-sm
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t.footerDescription}
              </p>
            </div>

            {/* Tools */}

            <div>
              <h3 className="text-sm font-bold">{t.tools}</h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/ctc-calculator"
                  className="
                    block
                    text-sm
                    text-slate-500
                    transition
                    hover:text-emerald-500
                    dark:hover:text-emerald-400
                  "
                >
                  {t.ctcToInHand}
                </Link>

                <span
                  className="
                    block
                    text-sm
                    text-slate-400
                  "
                >
                  {t.incomeTax}
                </span>

                <span
                  className="
                    block
                    text-sm
                    text-slate-400
                  "
                >
                  {t.epfCalculator}
                </span>

                <span
                  className="
                    block
                    text-sm
                    text-slate-400
                  "
                >
                  {t.sipCalculator}
                </span>
              </div>
            </div>

            {/* Moneyva */}

            <div>
              <h3 className="text-sm font-bold">{t.moneyva}</h3>

              <div className="mt-4 space-y-3">
                <a
                  href="#how-it-works"
                  className="
                    block
                    text-sm
                    text-slate-500
                    transition
                    hover:text-emerald-500
                    dark:hover:text-emerald-400
                  "
                >
                  {language === "hi" ? "यह कैसे काम करता है" : "How It Works"}
                </a>

                <span
                  className="
                    block
                    text-sm
                    text-slate-400
                  "
                >
                  {t.about}
                </span>

                <span
                  className="
                    block
                    text-sm
                    text-slate-400
                  "
                >
                  {t.privacy}
                </span>

                <span
                  className="
                    block
                    text-sm
                    text-slate-400
                  "
                >
                  {t.disclaimer}
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}

          <div
            className="
              mt-10
              border-t
              border-slate-200
              pt-6
              text-xs
              text-slate-500
              dark:border-white/10
            "
          >
            © {new Date().getFullYear()} Moneyva. {t.rights}
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   ARROW
========================================================= */

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />

      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* =========================================================
   TRUST POINT
========================================================= */

function TrustPoint({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className="
          text-emerald-500
          dark:text-emerald-400
        "
      >
        ✓
      </span>

      {text}
    </span>
  );
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-4
        dark:border-white/10
        dark:bg-white/[0.03]
      "
    >
      <p
        className="
          text-xs
          leading-5
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="
        px-4
        py-7
        text-center
        sm:px-8
      "
    >
      <p
        className="
          text-xl
          font-extrabold
          text-emerald-500
          sm:text-2xl
          dark:text-emerald-400
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-slate-500
          sm:text-sm
          dark:text-slate-400
        "
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   TOOL CARD
========================================================= */

function ToolCard({
  icon,
  title,
  description,
  href,
  available = false,
  availableText,
  tryText,
}: {
  icon: string;
  title: string;
  description: string;
  href?: string;
  available?: boolean;
  availableText: string;
  tryText?: string;
}) {
  const content = (
    <div
      className={`
        group
        relative
        h-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        dark:border-white/10
        dark:bg-[#0D1B2A]
        dark:shadow-none

        ${
          available
            ? `
              hover:-translate-y-1
              hover:border-emerald-400/30
              hover:shadow-xl
              dark:hover:bg-[#102131]
            `
            : "opacity-70"
        }
      `}
    >
      <div
        className="
          flex
          items-start
          justify-between
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-emerald-400/10
            text-lg
            font-extrabold
            text-emerald-500
            dark:text-emerald-400
          "
        >
          {icon}
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold

            ${
              available
                ? `
                  bg-emerald-400/10
                  text-emerald-600
                  dark:text-emerald-300
                `
                : `
                  bg-slate-100
                  text-slate-500
                  dark:bg-white/5
                  dark:text-slate-500
                `
            }
          `}
        >
          {availableText}
        </span>
      </div>

      <h3
        className="
          mt-6
          text-lg
          font-bold
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-slate-600
          dark:text-slate-400
        "
      >
        {description}
      </p>

      {available && tryText && (
        <div
          className="
            mt-5
            flex
            items-center
            gap-1
            text-sm
            font-bold
            text-emerald-500
            dark:text-emerald-400
          "
        >
          {tryText}

          <span
            className="
              transition
              group-hover:translate-x-1
            "
          >
            →
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-7
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-lg
        dark:border-white/10
        dark:bg-[#0D1B2A]
        dark:shadow-none
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-emerald-400/10
          text-sm
          font-extrabold
          text-emerald-500
          dark:text-emerald-400
        "
      >
        {number}
      </div>

      <h3
        className="
          mt-5
          text-xl
          font-bold
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-slate-600
          dark:text-slate-400
        "
      >
        {description}
      </p>
    </div>
  );
}
