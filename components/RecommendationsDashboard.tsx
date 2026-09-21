"use client";

import { useMemo, useState } from "react";

type StateRecord = {
  state: string;
  opportunity_score: number;
  pressure_score: number;
  decision_pattern: string;
  top_opportunity_driver: string;
  top_pressure_driver: string;
  forecast_momentum_pct: number;
};

type DistrictRecord = {
  series_id: string;
  state: string;
  canonical_district: string;
  digital_emerging_signal_score: number | null;
  development_support_context_score: number | null;
  signal_category: string;
  data_confidence: "high" | "medium" | "low";
  leading_signal_components: string;
};

type Props = {
  states: StateRecord[];
  districts: DistrictRecord[];
};

function statePatternLabel(value: string) {
  const labels: Record<string, string> = {
    emerging_opportunity: "Emerging Opportunity",
    growth_with_pressure: "Growth with Pressure",
    pressure_monitoring_priority:
      "Pressure Monitoring Priority",
    developing_or_early_signal:
      "Developing / Early Signal",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}

function districtCategoryLabel(value: string) {
  const labels: Record<string, string> = {
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

  return labels[value] ?? value.replaceAll("_", " ");
}

function stateGuidance(pattern: string) {
  const guidance: Record<
    string,
    {
      action: string;
      explanation: string;
    }
  > = {
    emerging_opportunity: {
      action:
        "Assess targeted promotion and local-product development",
      explanation:
        "The state shows an emerging opportunity pattern. Review local tourism products, infrastructure capacity and feasibility before scaling promotional activity.",
    },

    growth_with_pressure: {
      action:
        "Prioritise capacity, visitor dispersion and infrastructure review",
      explanation:
        "Growth signals are present alongside stronger monitoring-pressure signals. Further tourism expansion should be paired with capacity assessment and visitor-dispersion planning.",
    },

    pressure_monitoring_priority: {
      action:
        "Investigate capacity constraints before stimulating additional demand",
      explanation:
        "Monitoring-pressure signals are relatively stronger. Review tourism intensity, visitor growth and digital-interest momentum before increasing promotional activity.",
    },

    developing_or_early_signal: {
      action:
        "Validate tourism readiness before larger intervention",
      explanation:
        "The evidence is still developing. Assess local feasibility, tourism products, infrastructure and stakeholder readiness while continuing to monitor the available indicators.",
    },
  };

  return (
    guidance[pattern] ?? {
      action:
        "Continue monitoring and validate local readiness",
      explanation:
        "Review the available opportunity, pressure and forecast signals together with local feasibility and stakeholder evidence before taking action.",
    }
  );
}

function districtGuidance(category: string) {
  const guidance: Record<
    string,
    {
      action: string;
      explanation: string;
    }
  > = {
    emerging_signal_support_priority: {
      action:
        "Commission a local feasibility and community-readiness assessment",
      explanation:
        "The district combines a relatively strong digital emerging signal with higher Development Support Context. Validate infrastructure, community priorities and destination readiness before targeted development.",
    },

    rising_digital_interest: {
      action:
        "Assess readiness for targeted tourism promotion",
      explanation:
        "Digital interest is rising. Review tourism products, accessibility, infrastructure and local capacity before translating the signal into promotional activity.",
    },

    development_context_monitoring: {
      action:
        "Prioritise enabling conditions and tourism-readiness assessment",
      explanation:
        "Development-support needs are relatively higher while digital momentum is not among the strongest signals. Review infrastructure and local readiness before stimulating additional demand.",
    },

    stable_or_lower_digital_signal: {
      action:
        "Maintain monitoring before expanding intervention",
      explanation:
        "The current digital signal is relatively stable or lower. Continue observing changes over time and avoid escalating tourism-development activity without additional evidence.",
    },

    insufficient_digital_variation: {
      action:
        "Do not infer tourism momentum from this digital series",
      explanation:
        "The Google Trends series does not contain enough variation for a reliable digital emerging-signal score. Use other local evidence instead.",
    },

    digital_signal_only_context_incomplete: {
      action:
        "Validate socioeconomic context before development interpretation",
      explanation:
        "A digital signal is available, but socioeconomic context is incomplete. Avoid making development-support conclusions until additional context is available.",
    },
  };

  return (
    guidance[category] ?? {
      action:
        "Review local evidence before taking action",
      explanation:
        "Use the supplied digital and development-context indicators together with infrastructure, feasibility and stakeholder evidence.",
    }
  );
}

function confidenceStyle(
  confidence: "high" | "medium" | "low"
) {
  if (confidence === "high") {
    return "border-[#CBD5E1] bg-[#EAF0F6] text-[#1E3A5F]";
  }

  if (confidence === "medium") {
    return "border-amber-200 bg-[#FFF7E6] text-[#92400E]";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

function districtSignalStyle(category: string) {
  if (
    category ===
    "emerging_signal_support_priority"
  ) {
    return {
      card: "border-orange-200 bg-[#FFF8F3]",
      badge: "bg-[#FEECDC] text-[#9A3412]",
    };
  }

  return {
    card: "border-amber-200 bg-[#FFFCF7]",
    badge: "bg-[#FFF3D6] text-[#92400E]",
  };
}

export default function RecommendationsDashboard({
  states,
  districts,
}: Props) {
  const sortedStates = useMemo(
    () =>
      [...states].sort((a, b) =>
        a.state.localeCompare(b.state)
      ),
    [states]
  );

  const [selectedState, setSelectedState] =
    useState(sortedStates[0]?.state ?? "");

  const selected = useMemo(
    () =>
      sortedStates.find(
        (item) => item.state === selectedState
      ) ?? sortedStates[0],
    [selectedState, sortedStates]
  );

  const priorityDistricts = useMemo(
    () =>
      districts
        .filter(
          (item) =>
            item.state === selectedState &&
            (item.signal_category ===
              "emerging_signal_support_priority" ||
              item.signal_category ===
              "rising_digital_interest")
        )
        .sort((a, b) => {
          if (
            a.digital_emerging_signal_score ===
            null &&
            b.digital_emerging_signal_score ===
            null
          ) {
            return 0;
          }

          if (
            a.digital_emerging_signal_score ===
            null
          ) {
            return 1;
          }

          if (
            b.digital_emerging_signal_score ===
            null
          ) {
            return -1;
          }

          return (
            b.digital_emerging_signal_score -
            a.digital_emerging_signal_score
          );
        })
        .slice(0, 8),
    [districts, selectedState]
  );

  if (!selected) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        Recommendation data is currently unavailable.
      </div>
    );
  }

  const stateRecommendation =
    stateGuidance(selected.decision_pattern);

  return (
    <div>
      {/* STATE DECISION SUPPORT */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#14263D]">
              State Decision Support
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Select a state to translate model
              signals into monitoring guidance
            </p>
          </div>

          <select
            value={selectedState}
            onChange={(event) =>
              setSelectedState(event.target.value)
            }
            className="min-w-64 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none focus:border-[#F59E0B]"
          >
            {sortedStates.map((item) => (
              <option
                key={item.state}
                value={item.state}
              >
                {item.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STATE PROFILE */}

      <div className="mt-6 rounded-2xl bg-[#1E3A5F] p-6 text-white">
        <p className="text-xs font-semibold tracking-wider text-[#FBBF24]">
          DECISION PATTERN
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {selected.state}
        </h2>

        <p className="mt-2 text-lg text-slate-200">
          {statePatternLabel(
            selected.decision_pattern
          )}
        </p>
      </div>

      {/* SCORE CONTEXT */}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Opportunity Score"
          value={selected.opportunity_score.toFixed(
            1
          )}
          description="Relative composite indicator"
        />

        <MetricCard
          title="Pressure Score"
          value={selected.pressure_score.toFixed(
            1
          )}
          description="Relative monitoring-pressure indicator"
        />

        <MetricCard
          title="Opportunity Driver"
          value={selected.top_opportunity_driver}
          description="Largest supplied opportunity contribution"
        />

        <MetricCard
          title="Pressure Driver"
          value={selected.top_pressure_driver}
          description="Largest supplied pressure contribution"
        />
      </div>

      {/* RECOMMENDATION */}

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-amber-200 bg-[#FFFCF7] p-6">
          <span className="inline-flex rounded-full bg-[#FFF3D6] px-3 py-1 text-[10px] font-bold tracking-wider text-[#92400E]">
            SUGGESTED DECISION DIRECTION
          </span>

          <h3 className="mt-4 text-2xl font-bold text-[#14263D]">
            {stateRecommendation.action}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {stateRecommendation.explanation}
          </p>

          <details className="mt-6 rounded-xl border border-amber-100 bg-[#FFFCF7]">
            <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-[#92400E]">
              Why this recommendation?
            </summary>

            <div className="border-t border-amber-100 px-5 py-4">
              <p className="text-xs leading-5 text-slate-500">
                This direction is based on the supplied state classification,
                leading drivers and relative Opportunity and Pressure Scores.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <EvidenceItem
                  title="Opportunity driver"
                  value={selected.top_opportunity_driver}
                />

                <EvidenceItem
                  title="Pressure driver"
                  value={selected.top_pressure_driver}
                />

                <EvidenceItem
                  title="Opportunity score"
                  value={selected.opportunity_score.toFixed(
                    1
                  )}
                />

                <EvidenceItem
                  title="Pressure score"
                  value={selected.pressure_score.toFixed(
                    1
                  )}
                />
              </div>
            </div>
          </details>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-[#FFF8F3] p-6">
          <span className="inline-flex rounded-full bg-[#FEECDC] px-3 py-1 text-[10px] font-bold tracking-wider text-[#9A3412]">
            INTERPRETATION
          </span>

          <h3 className="mt-4 text-lg font-bold text-[#9A3412]">
            Decision support, not an automatic
            policy decision
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#9A3412]">
            These recommendations are
            interface-level guidance derived from
            the supplied classification and leading
            drivers. The scores are relative
            indicators and should be combined with
            local capacity, infrastructure,
            environmental and stakeholder evidence
            before action.
          </p>
        </div>
      </div>

      {/* DISTRICT PRIORITIES */}

      <div className="mb-6 mt-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

          <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
            DISTRICT MONITORING
          </p>
        </div>

        <h2 className="text-2xl font-bold text-[#14263D]">
          District Signals to Review
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Districts in {selected.state} with
          emerging digital signals are surfaced for
          further investigation, not ranked as the
          best tourism destinations.
        </p>
      </div>

      {/* LIMITATION — NOW SHOWN BEFORE DISTRICT RESULTS */}

      <div className="mb-6 rounded-2xl border border-amber-200 bg-[#FFFCF7] p-5">
        <span className="inline-flex rounded-full bg-[#FFF3D6] px-3 py-1 text-[10px] font-bold tracking-wider text-[#92400E]">
          IMPORTANT LIMITATION
        </span>

        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Google Trends is used as a
          digital-interest proxy. Its index is
          normalized independently for each series,
          so these district signals describe
          relative momentum rather than absolute
          search volume or confirmed tourist demand.
        </p>
      </div>

      {/* DISTRICT RESULTS */}

      {priorityDistricts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {priorityDistricts.map(
            (district) => {
              const guidance =
                districtGuidance(
                  district.signal_category
                );

              const signalStyle =
                districtSignalStyle(
                  district.signal_category
                );

              return (
                <div
                  key={district.series_id}
                  className={`rounded-2xl border p-6 ${signalStyle.card}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold tracking-wider text-[#F59E0B]">
                        {district.state}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-[#14263D]">
                        {
                          district.canonical_district
                        }
                      </h3>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${confidenceStyle(
                        district.data_confidence
                      )}`}
                    >
                      {district.data_confidence
                        .charAt(0)
                        .toUpperCase() +
                        district.data_confidence.slice(
                          1
                        )}{" "}
                      confidence
                    </span>
                  </div>

                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${signalStyle.badge}`}
                  >
                    {districtCategoryLabel(
                      district.signal_category
                    )}
                  </span>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <EvidenceItem
                      title="Digital signal"
                      value={
                        district.digital_emerging_signal_score ===
                          null
                          ? "Unavailable"
                          : district.digital_emerging_signal_score.toFixed(
                            1
                          )
                      }
                    />

                    <EvidenceItem
                      title="Development context"
                      value={
                        district.development_support_context_score ===
                          null
                          ? "Unavailable"
                          : district.development_support_context_score.toFixed(
                            1
                          )
                      }
                    />
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-xs font-semibold text-slate-500">
                      Suggested direction
                    </p>

                    <p className="mt-2 font-semibold text-[#14263D]">
                      {guidance.action}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {guidance.explanation}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/80 bg-white/70 p-4">
                    <p className="text-xs text-slate-500">
                      Leading signal components
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#14263D]">
                      {
                        district.leading_signal_components
                      }
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
          No rising-digital-interest or
          support-priority district signals are
          currently available for {selected.state}.
          Review the AI Insights page for the full
          district signal set.
        </div>
      )}
    </div>
  );
}

function MetricCard({
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

      <p className="mt-2 text-xl font-bold capitalize text-[#D97706]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function EvidenceItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-[#14263D]">
        {value}
      </p>
    </div>
  );
}