import fs from "fs";
import path from "path";
import Papa from "papaparse";

import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";
import TourismTrendChart from "@/components/TourismTrendChart";
import StateComparisonChart from "@/components/StateComparisonChart";

import summaryMetrics from "@/datathon_final_package/summary_metrics.json";

import stateIntelligence from "@/ml/outputs/state_tourism_intelligence_latest.json";
import districtSignals from "@/ml/outputs/district_emerging_signals_latest.json";

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

  tourismTrendParsed.data.forEach(
    (row) => {
      const year = Number(
        row.year
      );

      const visitorsThousand =
        Number(
          row.domestic_visitors_000
        );

      if (
        !Number.isFinite(year) ||
        !Number.isFinite(
          visitorsThousand
        )
      ) {
        return;
      }

      const currentTotal =
        yearlyVisitors.get(
          year
        ) ?? 0;

      yearlyVisitors.set(
        year,
        currentTotal +
          visitorsThousand
      );
    }
  );

  const tourismTrendData =
    Array.from(
      yearlyVisitors.entries()
    )
      .sort(
        ([yearA], [yearB]) =>
          yearA - yearB
      )
      .map(
        ([
          year,
          visitorsThousand,
        ]) => ({
          year,
          visitors: Number(
            (
              visitorsThousand /
              1000
            ).toFixed(1)
          ),
        })
      );

  const stateComparisonPath =
    path.join(
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
          Number.isFinite(
            row.visitors
          )
      )
      .sort(
        (a, b) =>
          b.visitors -
          a.visitors
      )
      .slice(0, 8)
      .map((row) => ({
        ...row,
        visitors: Number(
          row.visitors.toFixed(
            1
          )
        ),
      }));

  const topOpportunityStates = [
    ...stateIntelligence,
  ]
    .sort(
      (a, b) =>
        b.opportunity_score -
        a.opportunity_score
    )
    .slice(0, 3);

  const topPressureStates = [
    ...stateIntelligence,
  ]
    .sort(
      (a, b) =>
        b.pressure_score -
        a.pressure_score
    )
    .slice(0, 3);

  const supportPriorityDistricts =
    districtSignals
      .filter(
        (item) =>
          item.signal_category ===
          "emerging_signal_support_priority"
      )
      .sort((a, b) => {
        const aScore =
          a.digital_emerging_signal_score ??
          -Infinity;

        const bScore =
          b.digital_emerging_signal_score ??
          -Infinity;

        return bScore - aScore;
      })
      .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:p-8 lg:p-10">
        {/* PAGE HEADER */}

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              SUSTAINABLE TOURISM INTELLIGENCE
            </p>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#14263D] sm:text-4xl">
            Dashboard Overview
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Explore tourism trends,
            economic performance and
            sustainability indicators
            across Malaysia.
          </p>
        </div>

        {/* INTERPRETATION PANEL */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-[#FFFCF7]">
          <div className="border-b border-amber-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#B45309]">
                  QUICK GUIDE
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#14263D]">
                  How to interpret this dashboard
                </h3>
              </div>

              <div className="rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-[#92400E]">
                Tourism statistics:{" "}
                {summaryMetrics.year_min}–
                {summaryMetrics.year_max}
                {" "}•{" "}
                Digital forecast: January 2026
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-amber-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-5 sm:p-6">
              <p className="text-sm font-bold text-[#D97706]">
                Opportunity
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                A relative state-level
                indicator combining tourism
                growth, spending value,
                digital momentum, tourism
                headroom and development
                context. Higher values
                indicate stronger combined
                opportunity signals, not
                guaranteed tourism growth or
                investment return.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm font-bold text-[#C2410C]">
                Pressure
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                A relative monitoring
                indicator based on tourism
                intensity, visitor growth and
                digital-interest momentum.
                Higher values indicate a
                stronger need for monitoring,
                not measured environmental
                damage.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm font-bold text-[#B45309]">
                Digital Signal
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                A relative district-level
                indicator of recent Google
                Trends momentum. Higher
                values indicate stronger
                digital-interest movement,
                not absolute search volume
                or confirmed tourist demand.
              </p>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}

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

        {/* TOURISM INTELLIGENCE SNAPSHOT */}

        <div className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-bold tracking-wider text-[#B45309]">
              TOURISM INTELLIGENCE SNAPSHOT
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#14263D]">
              Signals to Review
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              A quick view of the strongest
              relative state and district
              signals currently available in
              the analytical outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* TOP OPPORTUNITY */}

            <div className="rounded-2xl border border-amber-200 bg-[#FFFCF7] p-5">
              <p className="text-sm font-bold text-[#B45309]">
                Top Opportunity Signals
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Highest relative Opportunity
                Scores across Malaysian
                states.
              </p>

              <div className="mt-4 space-y-3">
                {topOpportunityStates.map(
                  (item, index) => (
                    <div
                      key={
                        item.state
                      }
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                    >
                      <div>
                        <p className="text-xs text-slate-400">
                          #
                          {index +
                            1}
                        </p>

                        <p className="font-semibold text-[#14263D]">
                          {
                            item.state
                          }
                        </p>
                      </div>

                      <p className="text-lg font-bold text-[#D97706]">
                        {item.opportunity_score.toFixed(
                          1
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* TOP PRESSURE */}

            <div className="rounded-2xl border border-orange-200 bg-[#FFF8F3] p-5">
              <p className="text-sm font-bold text-[#9A3412]">
                Highest Monitoring Pressure
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Highest relative
                monitoring-pressure scores
                across states.
              </p>

              <div className="mt-4 space-y-3">
                {topPressureStates.map(
                  (item, index) => (
                    <div
                      key={
                        item.state
                      }
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                    >
                      <div>
                        <p className="text-xs text-slate-400">
                          #
                          {index +
                            1}
                        </p>

                        <p className="font-semibold text-[#14263D]">
                          {
                            item.state
                          }
                        </p>
                      </div>

                      <p className="text-lg font-bold text-[#C2410C]">
                        {item.pressure_score.toFixed(
                          1
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* DISTRICT SUPPORT PRIORITY */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-[#1E3A5F]">
                District Support-Priority
                Signals
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Districts classified as
                Emerging Signal + Support
                Priority.
              </p>

              <div className="mt-4 space-y-3">
                {supportPriorityDistricts.map(
                  (item) => (
                    <div
                      key={
                        item.series_id
                      }
                      className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-[#14263D]">
                          {
                            item.canonical_district
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {
                            item.state
                          }
                        </p>
                      </div>

                      <p className="text-sm font-bold text-[#D97706]">
                        {item.digital_emerging_signal_score ===
                        null
                          ? "Unavailable"
                          : item.digital_emerging_signal_score.toFixed(
                              1
                            )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Scores are relative analytical
            signals for comparison and
            monitoring, not rankings of the
            “best” tourism destinations.
          </p>
        </div>

        {/* TOURISM TREND */}

        <div className="mt-6">
          <TourismTrendChart
            data={
              tourismTrendData
            }
          />
        </div>

        {/* STATE COMPARISON */}

        <div className="mt-6">
          <StateComparisonChart
            data={
              stateComparisonData
            }
          />
        </div>
      </main>
    </div>
  );
}