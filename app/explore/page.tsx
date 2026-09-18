import fs from "fs";
import path from "path";
import Papa from "papaparse";

import Sidebar from "@/components/Sidebar";
import ExploreDashboard from "@/components/ExploreDashboard";

type StateComparisonRow = {
  state: string;
  year: string;
  domestic_visitors_000: string;
  tourism_receipts_rm_million: string;
  tourism_growth_pct: string;
  spending_per_visitor_rm: string;
  tourism_intensity: string;
  google_search_interest: string;
  opportunity_pattern: string;
  pressure_pattern: string;
};

function parseNullableNumber(
  value: string
): number | null {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

export default function ExplorePage() {
  const csvPath = path.join(
    process.cwd(),
    "datathon_final_package",
    "chart_data",
    "state_comparison.csv"
  );

  const csvFile = fs.readFileSync(
    csvPath,
    "utf8"
  );

  const parsed =
    Papa.parse<StateComparisonRow>(
      csvFile,
      {
        header: true,
        skipEmptyLines: true,
      }
    );

  const stateData = parsed.data
    .map((row) => ({
      state: row.state,

      year: Number(row.year),

      visitors:
        Number(
          row.domestic_visitors_000
        ) / 1000,

      receipts:
        Number(
          row.tourism_receipts_rm_million
        ) / 1000,

      spendingPerVisitor:
        Number(
          row.spending_per_visitor_rm
        ),

      tourismGrowth:
        parseNullableNumber(
          row.tourism_growth_pct
        ),

      tourismIntensity:
        parseNullableNumber(
          row.tourism_intensity
        ),

      searchInterest:
        parseNullableNumber(
          row.google_search_interest
        ),

      opportunityPattern:
        row.opportunity_pattern ?? "",

      pressurePattern:
        row.pressure_pattern ?? "",
    }))
    .filter(
      (row) =>
        row.state &&
        Number.isFinite(row.year) &&
        Number.isFinite(row.visitors) &&
        Number.isFinite(row.receipts)
    )
    .sort((a, b) =>
      a.state.localeCompare(b.state)
    );

  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              DATA EXPLORATION
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14263D] sm:text-4xl">
            Explore Tourism Data
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Select a state to explore tourism performance,
            economic value and demand indicators across
            Malaysia.
          </p>
        </div>

        {/* INTERACTIVE EXPLORER */}

        <ExploreDashboard
          data={stateData}
        />
      </main>
    </div>
  );
}