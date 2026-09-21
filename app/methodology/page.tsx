import Sidebar from "@/components/Sidebar";

export default function MethodologyPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              DATA & MODEL TRANSPARENCY
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14263D] sm:text-4xl">
            Data Sources & Methodology
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
            How Databladez transforms official tourism statistics,
            socioeconomic context and Google Trends signals into
            comparative tourism intelligence.
          </p>
        </div>

        {/* COVERAGE */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <CoverageCard
            value="16"
            label="State series"
          />

          <CoverageCard
            value="151"
            label="District / area series"
          />

          <CoverageCard
            value="167"
            label="Forecast series"
          />

          <CoverageCard
            value="Jan 2026"
            label="Forecast month"
          />
        </div>

        {/* DATA SOURCES */}

        <section className="mt-8">
          <SectionHeader
            eyebrow="DATA SOURCES"
            title="Evidence used by the dashboard"
            description="The dashboard combines official Malaysian statistics with digital-interest signals. Each source is kept conceptually separate."
          />

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SourceCard
              title="DOSM Tourism Statistics"
              description="Domestic visitor, tourism receipts, trips, growth and related state-level tourism indicators."
              period="Tourism statistics: 2019–2025"
              href="https://www.dosm.gov.my/portal-main/release-content/domestic-tourism-survey-states-2025"
            />

            <SourceCard
              title="OpenDOSM Socioeconomic Context"
              description="Population, household income, poverty and unemployment indicators used as supporting development context."
              period="Latest available supporting years"
              href="https://open.dosm.gov.my/"
            />

            <SourceCard
              title="Google Trends"
              description="Monthly search-interest series used as a relative digital-interest proxy and for next-month forecasting."
              period="Forecast: January 2026"
              href="https://trends.google.com/trends/"
            />
          </div>
        </section>

        {/* METHODOLOGY FLOW */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="ANALYTICAL PIPELINE"
            title="From data to decision support"
            description="Scores and forecasts are precomputed by the analytical pipeline and displayed by the dashboard without recalculating them in the frontend."
          />

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <MethodCard
              number="01"
              title="Prepare"
              description="Clean and standardise tourism, socioeconomic and digital-interest datasets and align geographic series."
            />

            <MethodCard
              number="02"
              title="Forecast"
              description="State forecasts use a three-month mean with CatBoost residual correction. District forecasts use a three-month mean."
            />

            <MethodCard
              number="03"
              title="Score"
              description="Generate relative state Opportunity and Pressure indicators and district digital-emerging signals."
            />

            <MethodCard
              number="04"
              title="Interpret"
              description="Present classifications, leading drivers, confidence and conditional decision-support guidance."
            />
          </div>
        </section>

        {/* MODEL PERFORMANCE */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="MODEL VALIDATION"
            title="Forecast performance"
            description="The forecasting approach was evaluated before final testing."
          />

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <PerformanceMetric
                label="Hybrid MAE"
                value="1.821"
              />

              <PerformanceMetric
                label="Baseline MAE"
                value="1.854"
              />

              <PerformanceMetric
                label="Test MAE improvement"
                value="1.82%"
              />
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm leading-7 text-slate-500">
                Rolling-origin validation used 2022, 2023 and 2024.
                Final evaluation used the untouched 2025 test set.
                MAE represents average forecasting error in Google
                Trends index points, where lower values indicate
                lower error.
              </p>
            </div>
          </div>
        </section>

        {/* SCORE DEFINITIONS */}

        <section className="mt-10">
          <SectionHeader
            eyebrow="INDICATOR DEFINITIONS"
            title="What the scores mean"
            description="The dashboard uses comparative indicators rather than probabilities or guaranteed outcomes."
          />

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DefinitionCard
              title="Opportunity Score"
              description="Relative state-level composite combining visitor growth, tourism spending value, forecast momentum, search growth, tourism headroom and development context."
              caution="Not investment return, destination quality or probability of tourism growth."
            />

            <DefinitionCard
              title="Pressure Score"
              description="Relative monitoring-pressure indicator based on tourism intensity, visitor growth, forecast momentum and search growth."
              caution="Not a direct measure of environmental damage, emissions or visitor dissatisfaction."
            />

            <DefinitionCard
              title="Digital Emerging Signal"
              description="Relative 0–100 district-level digital-momentum score based on recent and annual change, trend slope and projected next-month change."
              caution="Not absolute search volume or probability of future tourist growth."
            />
          </div>
        </section>

        {/* LIMITATIONS */}

        <section className="mt-10">
          <div className="rounded-2xl border border-amber-200 bg-[#FFFCF7] p-6">
            <p className="text-xs font-bold tracking-wider text-[#B45309]">
              KEY LIMITATIONS
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#14263D]">
              Interpret the indicators with context
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              <p>
                • Google Trends is a digital-interest proxy. Each
                geographic series is independently normalised, so
                raw index levels should not be used to compare
                absolute search volume between districts.
              </p>

              <p>
                • The forecast predicts next-month Google Trends
                search interest, not tourist arrivals, tourism
                receipts or hotel occupancy.
              </p>

              <p>
                • Opportunity and Pressure Scores are relative
                indicators across Malaysian states and should be
                combined with local infrastructure, environmental
                and stakeholder evidence.
              </p>

              <p>
                • District records without sufficient digital
                variation are reported as unavailable rather than
                assigned a score of zero.
              </p>

              <p>
                • Development Support Context is a socioeconomic
                indicator and does not imply stronger tourism demand
                or tourism potential.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-[#B45309]">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-xl font-bold text-[#14263D]">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function CoverageCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-2xl font-bold text-[#D97706]">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SourceCard({
  title,
  description,
  period,
  href,
}: {
  title: string;
  description: string;
  period: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 h-1 w-10 rounded-full bg-[#F59E0B]" />

      <h3 className="font-bold text-[#14263D]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <p className="mt-4 text-xs font-medium text-[#92400E]">
        {period}
      </p>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex text-xs font-semibold text-[#1E3A5F] underline decoration-amber-400 underline-offset-4"
      >
        View source
      </a>
    </div>
  );
}

function MethodCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="text-xs font-bold text-[#D97706]">
        {number}
      </span>

      <h3 className="mt-3 font-bold text-[#14263D]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function PerformanceMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#D97706]">
        {value}
      </p>
    </div>
  );
}

function DefinitionCard({
  title,
  description,
  caution,
}: {
  title: string;
  description: string;
  caution: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-bold text-[#14263D]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-4 rounded-xl bg-[#FFF7E6] p-4">
        <p className="text-xs leading-5 text-[#92400E]">
          {caution}
        </p>
      </div>
    </div>
  );
}