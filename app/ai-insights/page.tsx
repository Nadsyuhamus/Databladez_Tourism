import Sidebar from "@/components/Sidebar";

import StateIntelligenceDashboard from "@/components/StateIntelligenceDashboard";

import DistrictIntelligenceDashboard, {
  type DistrictSignalRecord,
} from "@/components/DistrictIntelligenceDashboard";

import stateIntelligence from "@/ml/outputs/state_tourism_intelligence_latest.json";

import districtIntelligence from "@/ml/outputs/district_emerging_signals_latest.json";

export default function AIInsightsPage() {
  if (
    !Array.isArray(stateIntelligence) ||
    !Array.isArray(districtIntelligence)
  ) {
    return (
      <div className="flex min-h-screen bg-[#F6F7F9]">
        <Sidebar />

        <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            Tourism intelligence data is currently unavailable.
          </div>
        </main>
      </div>
    );
  }

  const districtData =
    districtIntelligence as unknown as DistrictSignalRecord[];

  if (stateIntelligence.length !== 16) {
    console.warn(
      `Unexpected state intelligence record count: ${stateIntelligence.length}`
    );
  }

  if (districtData.length !== 151) {
    console.warn(
      `Unexpected district intelligence record count: ${districtData.length}`
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              AI & MODEL INTELLIGENCE
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14263D] sm:text-4xl">
            Tourism Intelligence
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Explore state-level tourism intelligence,
            next-month digital-interest forecasts and district-level
            emerging signals across Malaysia.
          </p>
        </div>

        {/* STATE INTELLIGENCE */}

        <StateIntelligenceDashboard
          data={stateIntelligence}
        />

        {/* DISTRICT INTELLIGENCE */}

        <DistrictIntelligenceDashboard
          data={districtData}
        />
      </main>
    </div>
  );
}