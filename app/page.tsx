import fs from "fs";
import path from "path";
import Papa from "papaparse";

import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";
import TourismTrendChart from "@/components/TourismTrendChart";
import StateComparisonChart from "@/components/StateComparisonChart";

import summaryMetrics from "@/datathon_final_package/summary_metrics.json";

type TourismTrendRow = {
  state: string;
  year: string;
  domestic_visitors_000: string;
  tourism_receipts_rm_million: string;
  tourism_growth_pct: string;
  tourism_value_growth_pct: string;
  tourism_intensity: string;
  google_search_interest: string;
  search_interest_growth_pct: string;
};

type StateComparisonRow = {
  state: string;
  year: string;
  domestic_visitors_000: string;
  tourism_receipts_rm_million: string;
  tourism_trips_000: string;
  tourism_growth_pct: string;
  spending_per_visitor_rm: string;
  trips_per_visitor: string;
  tourism_intensity: string;
  tourism_value_growth_pct: string;
  local_prosperity_context: string;
  income_mean: string;
  income_median: string;
  expenditure_mean: string;
  gini: string;
  poverty: string;
  google_search_interest: string;
  search_interest_growth_pct: string;
  digital_interest_trend: string;
  emerging_viral_destination: string;
  opportunity_pattern: string;
  pressure_pattern: string;
  average_length_of_stay: string;
  population_000: string;
  avg_receipts_per_trip_rm: string;
  tourism_receipts_rm: string;
  domestic_visitors: string;
};

export default function Home() {
  // =========================================================
  // KPI DATA
  // =========================================================

  const totalVisitors =
    summaryMetrics.total_domestic_visitors_000_latest * 1000;

  const totalVisitorsDisplay = `${(
    totalVisitors / 1_000_000
  ).toFixed(1)}M`;

  const tourismReceipts =
    summaryMetrics.total_tourism_receipts_rm_million_latest;

  const tourismReceiptsDisplay = `RM ${(
    tourismReceipts / 1000
  ).toFixed(1)}B`;

  const topStateVisitors =
    summaryMetrics.top_state_visitors_000_latest * 1000;

  const topStateVisitorsDisplay = `${(
    topStateVisitors / 1_000_000
  ).toFixed(1)}M`;

  // =========================================================
  // TOURISM TREND CSV
  // =========================================================

  const tourismTrendPath = path.join(
    process.cwd(),
    "datathon_final_package",
    "chart_data",
    "tourism_trend.csv"
  );

  const tourismTrendFile = fs.readFileSync(
    tourismTrendPath,
    "utf8"
  );

  const tourismTrendParsed =
    Papa.parse<TourismTrendRow>(
      tourismTrendFile,
      {
        header: true,
        skipEmptyLines: true,
      }
    );

  const yearlyVisitors = new Map<
    number,
    number
  >();

  tourismTrendParsed.data.forEach((row) => {
    const year = Number(row.year);

    const visitorsThousand = Number(
      row.domestic_visitors_000
    );

    if (
      !Number.isFinite(year) ||
      !Number.isFinite(visitorsThousand)
    ) {
      return;
    }

    const currentTotal =
      yearlyVisitors.get(year) ?? 0;

    yearlyVisitors.set(
      year,
      currentTotal + visitorsThousand
    );
  });

  const tourismTrendData = Array.from(
    yearlyVisitors.entries()
  )
    .sort(
      ([yearA], [yearB]) =>
        yearA - yearB
    )
    .map(
      ([year, visitorsThousand]) => ({
        year,

        visitors: Number(
          (
            visitorsThousand / 1000
          ).toFixed(1)
        ),
      })
    );

  // =========================================================
  // STATE COMPARISON CSV
  // =========================================================

  const stateComparisonPath = path.join(
    process.cwd(),
    "datathon_final_package",
    "chart_data",
    "state_comparison.csv"
  );

  const stateComparisonFile =
    fs.readFileSync(
      stateComparisonPath,
      "utf8"
    );

  const stateComparisonParsed =
    Papa.parse<StateComparisonRow>(
      stateComparisonFile,
      {
        header: true,
        skipEmptyLines: true,
      }
    );

  const stateComparisonData =
    stateComparisonParsed.data
      .map((row) => ({
        state: row.state,

        visitors:
          Number(
            row.domestic_visitors_000
          ) / 1000,
      }))
      .filter(
        (row) =>
          row.state &&
          Number.isFinite(row.visitors)
      )
      .sort(
        (a, b) =>
          b.visitors - a.visitors
      )
      .slice(0, 8)
      .map((row) => ({
        ...row,

        visitors: Number(
          row.visitors.toFixed(1)
        ),
      }));

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8 lg:p-10">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              SUSTAINABLE TOURISM
              INTELLIGENCE
            </p>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#14263D]">
            Dashboard Overview
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Explore tourism trends,
            economic performance and
            sustainability indicators
            across Malaysia.
          </p>
        </div>

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Domestic Visitors"
            value={
              totalVisitorsDisplay
            }
            description={`Malaysia, ${summaryMetrics.latest_year}`}
          />

          <KpiCard
            title="Tourism Receipts"
            value={
              tourismReceiptsDisplay
            }
            description={`Malaysia, ${summaryMetrics.latest_year}`}
          />

          <KpiCard
            title="Top State by Visitors"
            value={
              summaryMetrics.top_state_by_visitors_latest
            }
            description={`${topStateVisitorsDisplay} visitors in ${summaryMetrics.latest_year}`}
          />

          <KpiCard
            title="Regions Covered"
            value={summaryMetrics.state_count.toString()}
            description={`${summaryMetrics.year_min}–${summaryMetrics.year_max} data coverage`}
          />
        </div>

        {/* ===================================================
            NATIONAL TREND
        =================================================== */}

        <div className="mt-6">
          <TourismTrendChart
            data={tourismTrendData}
          />
        </div>

        {/* ===================================================
            STATE COMPARISON
        =================================================== */}

        <div className="mt-6">
          <StateComparisonChart
            data={stateComparisonData}
          />
        </div>
      </main>
    </div>
  );
}