"use client";

import { useMemo, useState } from "react";

type DataConfidence = "high" | "medium" | "low";

type SignalQuality =
  | "informative"
  | "limited_variation"
  | "insufficient_variation";

type SignalCategory =
  | "emerging_signal_support_priority"
  | "rising_digital_interest"
  | "development_context_monitoring"
  | "stable_or_lower_digital_signal"
  | "insufficient_digital_variation"
  | "digital_signal_only_context_incomplete";

export type DistrictSignalRecord = {
  series_id: string;

  state: string;
  area: string;
  canonical_district: string;

  mapping_confidence: "high" | "medium";

  latest_observed_month: string;
  latest_observed_trend: number;

  forecast_month: string;
  forecast_trend_index: number;
  forecast_method: string;

  short_term_change_pct: number;
  annual_change_pct: number;
  normalized_12m_slope_pct: number;
  projected_change_pct: number;

  digital_emerging_signal_score: number | null;

  population_000: number | null;
  population_000_year: number | null;

  income_median: number | null;
  income_median_year: number | null;

  poverty: number | null;
  poverty_year: number | null;

  u_rate: number | null;
  u_rate_year: number | null;

  context_component_count: number;

  development_support_context_score:
    | number
    | null;

  signal_quality: SignalQuality;
  signal_category: SignalCategory;

  leading_signal_components: string;

  data_confidence: DataConfidence;
};

type Props = {
  data: DistrictSignalRecord[];
};

type SortOption =
  | "digital_desc"
  | "development_desc"
  | "district_asc";

const CATEGORY_LABELS: Record<
  SignalCategory,
  string
> = {
  emerging_signal_support_priority:
    "Emerging Signal + Support Priority",

  rising_digital_interest:
    "Rising Digital Interest",

  development_context_monitoring:
    "Development Context Monitoring",

  stable_or_lower_digital_signal:
    "Stable or Lower Digital Signal",

  insufficient_digital_variation:
    "Insufficient Digital Variation",

  digital_signal_only_context_incomplete:
    "Digital Signal Available — Context Incomplete",
};

const ITEMS_PER_PAGE = 10;

function categoryLabel(
  category: SignalCategory
) {
  return (
    CATEGORY_LABELS[category] ??
    category.replaceAll("_", " ")
  );
}

function confidenceLabel(
  confidence: DataConfidence
) {
  return `${confidence
    .charAt(0)
    .toUpperCase()}${confidence.slice(
    1
  )} confidence`;
}

function qualityLabel(
  quality: SignalQuality
) {
  const labels: Record<
    SignalQuality,
    string
  > = {
    informative: "Informative",
    limited_variation:
      "Limited variation",
    insufficient_variation:
      "Insufficient variation",
  };

  return labels[quality];
}

function scoreDisplay(
  value: number | null
) {
  if (value === null) {
    return "Unavailable";
  }

  return value.toFixed(1);
}

function formatPercent(
  value: number
) {
  return `${value > 0 ? "+" : ""}${value.toFixed(
    1
  )}%`;
}

function formatMonth(
  value: string
) {
  const clean = value.slice(0, 7);

  const [year, month] =
    clean.split("-");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex =
    Number(month) - 1;

  return `${months[monthIndex]} ${year}`;
}

function sortNullableDesc(
  a: number | null,
  b: number | null
) {
  if (a === null && b === null)
    return 0;

  if (a === null) return 1;

  if (b === null) return -1;

  return b - a;
}

export default function DistrictIntelligenceDashboard({
  data,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [stateFilter, setStateFilter] =
    useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [
    confidenceFilter,
    setConfidenceFilter,
  ] = useState("all");

  const [sortBy, setSortBy] =
    useState<SortOption>(
      "digital_desc"
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const [
    selectedSeriesId,
    setSelectedSeriesId,
  ] = useState<string | null>(
    data[0]?.series_id ?? null
  );

  const states = useMemo(
    () =>
      Array.from(
        new Set(
          data.map(
            (item) => item.state
          )
        )
      ).sort(),
    [data]
  );

  const summary = useMemo(() => {
    const scored = data.filter(
      (item) =>
        item.digital_emerging_signal_score !==
        null
    ).length;

    const highConfidence =
      data.filter(
        (item) =>
          item.data_confidence ===
          "high"
      ).length;

    const priority =
      data.filter(
        (item) =>
          item.signal_category ===
          "emerging_signal_support_priority"
      ).length;

    return {
      total: data.length,
      scored,
      highConfidence,
      priority,
    };
  }, [data]);

  const filteredData = useMemo(
    () => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      const result =
        data.filter((item) => {
          const matchesSearch =
            !normalizedSearch ||
            item.area
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            item.canonical_district
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            item.state
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesState =
            stateFilter ===
              "all" ||
            item.state ===
              stateFilter;

          const matchesCategory =
            categoryFilter ===
              "all" ||
            item.signal_category ===
              categoryFilter;

          const matchesConfidence =
            confidenceFilter ===
              "all" ||
            item.data_confidence ===
              confidenceFilter;

          return (
            matchesSearch &&
            matchesState &&
            matchesCategory &&
            matchesConfidence
          );
        });

      return result.sort(
        (a, b) => {
          if (
            sortBy ===
            "digital_desc"
          ) {
            return sortNullableDesc(
              a.digital_emerging_signal_score,
              b.digital_emerging_signal_score
            );
          }

          if (
            sortBy ===
            "development_desc"
          ) {
            return sortNullableDesc(
              a.development_support_context_score,
              b.development_support_context_score
            );
          }

          return a.canonical_district.localeCompare(
            b.canonical_district
          );
        }
      );
    },
    [
      data,
      search,
      stateFilter,
      categoryFilter,
      confidenceFilter,
      sortBy,
    ]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const pageStartIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedData =
    filteredData.slice(
      pageStartIndex,
      pageStartIndex + ITEMS_PER_PAGE
    );

  const showingStart =
    filteredData.length === 0
      ? 0
      : pageStartIndex + 1;

  const showingEnd = Math.min(
    pageStartIndex + ITEMS_PER_PAGE,
    filteredData.length
  );

  const selectedDistrict =
    useMemo(() => {
      const selected =
        paginatedData.find(
          (item) =>
            item.series_id ===
            selectedSeriesId
        );

      if (selected) {
        return selected;
      }

      return (
        paginatedData[0] ??
        null
      );
    }, [
      paginatedData,
      selectedSeriesId,
    ]);

  function goToPreviousPage() {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  }

  function goToNextPage() {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  }

  return (
    <div>
      {/* =========================
          SECTION HEADER
      ========================== */}

      <div className="mb-6 mt-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

          <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
            DISTRICT SIGNAL INTELLIGENCE
          </p>
        </div>

        <h2 className="text-2xl font-bold text-[#14263D]">
          District Emerging Signals
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Explore relative digital-interest
          momentum, development-support
          context and data confidence across
          Malaysian districts and areas.
        </p>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-[#FFF7E6] p-5">
          <p className="text-sm font-semibold text-[#92400E]">
            How to interpret district signals
          </p>

          <p className="mt-2 max-w-4xl text-xs leading-6 text-[#92400E]">
            The digital emerging-signal
            score compares recent changes
            within each district&apos;s own
            Google Trends series. It
            represents relative momentum,
            not absolute search-market size
            or probability of tourism
            growth. Development Support
            Context is a separate
            socioeconomic indicator and
            should not be interpreted as
            tourism demand.
          </p>
        </div>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="District / Area Series"
          value={summary.total.toString()}
          description="Available district-level records"
        />

        <SummaryCard
          title="Scored Digital Signals"
          value={summary.scored.toString()}
          description="Records with a valid digital score"
        />

        <SummaryCard
          title="High Confidence"
          value={summary.highConfidence.toString()}
          description="Records classified as high confidence"
        />

        <SummaryCard
          title="Support Priority Signals"
          value={summary.priority.toString()}
          description="Emerging signal + support priority"
        />
      </div>

      {/* =========================
          FILTERS
      ========================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <FilterGroup label="Search">
            <input
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              placeholder="Search district..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#14263D] outline-none transition placeholder:text-slate-400 focus:border-[#F59E0B]"
            />
          </FilterGroup>

          <FilterGroup label="State">
            <select
              value={stateFilter}
              onChange={(event) => {
                setStateFilter(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none focus:border-[#F59E0B]"
            >
              <option value="all">
                All states
              </option>

              {states.map(
                (state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                )
              )}
            </select>
          </FilterGroup>

          <FilterGroup label="Signal Category">
            <select
              value={
                categoryFilter
              }
              onChange={(event) => {
                setCategoryFilter(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none focus:border-[#F59E0B]"
            >
              <option value="all">
                All categories
              </option>

              {Object.entries(
                CATEGORY_LABELS
              ).map(
                ([
                  value,
                  label,
                ]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>
          </FilterGroup>

          <FilterGroup label="Confidence">
            <select
              value={
                confidenceFilter
              }
              onChange={(event) => {
                setConfidenceFilter(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none focus:border-[#F59E0B]"
            >
              <option value="all">
                All confidence
              </option>

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>
            </select>
          </FilterGroup>

          <FilterGroup label="Sort">
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(
                  event.target
                    .value as SortOption
                );
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none focus:border-[#F59E0B]"
            >
              <option value="digital_desc">
                Digital score
              </option>

              <option value="development_desc">
                Development context
              </option>

              <option value="district_asc">
                District A–Z
              </option>
            </select>
          </FilterGroup>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          {filteredData.length} matching{" "}
          {filteredData.length === 1
            ? "record"
            : "records"} of{" "}
          {data.length} total
        </p>
      </div>

      {/* =========================
          TABLE + DETAIL
      ========================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <TableHeader>
                    District
                  </TableHeader>

                  <TableHeader>
                    State
                  </TableHeader>

                  <TableHeader>
                    Digital Signal
                  </TableHeader>

                  <TableHeader>
                    Development Context
                  </TableHeader>

                  <TableHeader>
                    Category
                  </TableHeader>

                  <TableHeader>
                    Confidence
                  </TableHeader>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map(
                  (item) => {
                    const isSelected =
                      selectedDistrict?.series_id ===
                      item.series_id;

                    return (
                      <tr
                        key={
                          item.series_id
                        }
                        onClick={() =>
                          setSelectedSeriesId(
                            item.series_id
                          )
                        }
                        className={`cursor-pointer border-b border-slate-100 transition last:border-b-0 ${
                          isSelected
                            ? "bg-[#FFF7E6]"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <TableCell>
                          <div>
                            <p className="font-semibold text-[#14263D]">
                              {
                                item.canonical_district
                              }
                            </p>

                            {item.area !==
                              item.canonical_district && (
                              <p className="mt-1 text-xs text-slate-400">
                                Search label:{" "}
                                {
                                  item.area
                                }
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          {
                            item.state
                          }
                        </TableCell>

                        <TableCell>
                          {item.digital_emerging_signal_score ===
                          null ? (
                            <span className="text-xs font-medium text-slate-400">
                              Unavailable
                            </span>
                          ) : (
                            <span className="font-semibold text-[#1E3A5F]">
                              {item.digital_emerging_signal_score.toFixed(
                                1
                              )}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {item.development_support_context_score ===
                          null ? (
                            <span className="text-xs text-slate-400">
                              Unavailable
                            </span>
                          ) : (
                            <span className="font-semibold text-[#1E3A5F]">
                              {item.development_support_context_score.toFixed(
                                1
                              )}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <CategoryBadge
                            category={
                              item.signal_category
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <ConfidenceBadge
                            confidence={
                              item.data_confidence
                            }
                          />
                        </TableCell>
                      </tr>
                    );
                  }
                )}

                {filteredData.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-12 text-center text-sm text-slate-500"
                    >
                      No locations
                      match the
                      selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing {showingStart}–{showingEnd} of{" "}
              {filteredData.length} matching records
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={
                  safeCurrentPage === 1 ||
                  filteredData.length === 0
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#1E3A5F] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span aria-hidden="true">
                  ←
                </span>
                Previous
              </button>

              <span className="min-w-24 text-center text-xs font-semibold text-slate-600">
                Page {safeCurrentPage} of{" "}
                {totalPages}
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={
                  safeCurrentPage === totalPages ||
                  filteredData.length === 0
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#1E3A5F] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <span aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* DETAIL */}

        <div>
          {selectedDistrict ? (
            <DistrictDetail
              item={
                selectedDistrict
              }
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              Select a district
              to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================
   DETAIL PANEL
========================================= */

function DistrictDetail({
  item,
}: {
  item: DistrictSignalRecord;
}) {
  return (
    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-bold tracking-wider text-[#F59E0B]">
        DISTRICT DETAIL
      </p>

      <h3 className="mt-3 text-2xl font-bold text-[#14263D]">
        {item.canonical_district}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {item.state}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge
          category={
            item.signal_category
          }
        />

        <ConfidenceBadge
          confidence={
            item.data_confidence
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <DetailMetric
          label="Digital Signal"
          value={scoreDisplay(
            item.digital_emerging_signal_score
          )}
        />

        <DetailMetric
          label="Development Context"
          value={scoreDisplay(
            item.development_support_context_score
          )}
        />

        <DetailMetric
          label="Forecast Search Index"
          value={item.forecast_trend_index.toFixed(
            1
          )}
        />

        <DetailMetric
          label="Forecast Month"
          value={formatMonth(
            item.forecast_month
          )}
        />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-slate-500">
          Leading signal components
        </p>

        <p className="mt-2 text-sm leading-6 text-[#14263D]">
          {
            item.leading_signal_components
          }
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <SmallDetail
          label="3-month change"
          value={formatPercent(
            item.short_term_change_pct
          )}
        />

        <SmallDetail
          label="12-month change"
          value={formatPercent(
            item.annual_change_pct
          )}
        />

        <SmallDetail
          label="Projected change"
          value={formatPercent(
            item.projected_change_pct
          )}
        />

        <SmallDetail
          label="Signal quality"
          value={qualityLabel(
            item.signal_quality
          )}
        />
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-500">
          Confidence
        </p>

        <p className="mt-2 text-sm font-semibold text-[#14263D]">
          {confidenceLabel(
            item.data_confidence
          )}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Signal quality:{" "}
          {qualityLabel(
            item.signal_quality
          )}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Mapping confidence:{" "}
          {item.mapping_confidence
            .charAt(0)
            .toUpperCase() +
            item.mapping_confidence.slice(
              1
            )}
        </p>
      </div>

      {item.digital_emerging_signal_score ===
        null && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            Insufficient digital
            variation for a reliable
            score.
          </p>
        </div>
      )}

      {item.development_support_context_score ===
        null && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            Development context
            is unavailable for this
            district.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================
   UI HELPERS
========================================= */

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 h-1 w-10 rounded-full bg-[#F59E0B]" />

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#14263D]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-500">
        {label}
      </label>

      {children}
    </div>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-4 py-4 align-middle text-slate-600">
      {children}
    </td>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: DataConfidence;
}) {
  const styles = {
    high:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    medium:
      "bg-amber-50 text-amber-700 border-amber-200",

    low:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[confidence]}`}
    >
      {confidenceLabel(
        confidence
      )}
    </span>
  );
}

function CategoryBadge({
  category,
}: {
  category: SignalCategory;
}) {
  const styles: Record<
    SignalCategory,
    string
  > = {
    emerging_signal_support_priority:
      "bg-purple-50 text-purple-700 border-purple-200",

    rising_digital_interest:
      "bg-blue-50 text-blue-700 border-blue-200",

    development_context_monitoring:
      "bg-orange-50 text-orange-700 border-orange-200",

    stable_or_lower_digital_signal:
      "bg-slate-100 text-slate-600 border-slate-200",

    insufficient_digital_variation:
      "bg-gray-100 text-gray-500 border-gray-200",

    digital_signal_only_context_incomplete:
      "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`inline-flex max-w-52 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[category]}`}
    >
      {categoryLabel(
        category
      )}
    </span>
  );
}

function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-[#1E3A5F]">
        {value}
      </p>
    </div>
  );
}

function SmallDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#14263D]">
        {value}
      </p>
    </div>
  );
}