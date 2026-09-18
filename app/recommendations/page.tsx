import type { ComponentProps } from "react";

import Sidebar from "@/components/Sidebar";
import RecommendationsDashboard from "@/components/RecommendationsDashboard";

import stateIntelligence from "@/ml/outputs/state_tourism_intelligence_latest.json";
import districtIntelligence from "@/ml/outputs/district_emerging_signals_latest.json";

type RecommendationsProps = ComponentProps<
  typeof RecommendationsDashboard
>;

export default function RecommendationsPage() {
  if (
    !Array.isArray(stateIntelligence) ||
    !Array.isArray(districtIntelligence)
  ) {
    return (
      <div className="flex min-h-screen bg-[#F6F7F9]">
        <Sidebar />

        <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            Recommendation data is currently unavailable.
          </div>
        </main>
      </div>
    );
  }

  const stateData =
    stateIntelligence as unknown as RecommendationsProps["states"];

  const districtData =
    districtIntelligence as unknown as RecommendationsProps["districts"];

  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              DECISION SUPPORT
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14263D] sm:text-4xl">
            Tourism Recommendations
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Translate tourism intelligence into evidence-based
            monitoring and destination-development directions
            while preserving the limitations of the underlying
            data and model outputs.
          </p>
        </div>

        {/* RECOMMENDATIONS DASHBOARD */}

        <RecommendationsDashboard
          states={stateData}
          districts={districtData}
        />
      </main>
    </div>
  );
}