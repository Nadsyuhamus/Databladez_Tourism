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
    pressure_monitoring_priority: "Pressure Monitoring Priority",
    developing_or_early_signal: "Developing / Early Signal",
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
        "Evaluate targeted tourism development opportunities",
      explanation:
        "The state shows relatively stronger opportunity signals. Review the leading opportunity driver together with pressure indicators before expanding tourism activity.",
    },

    growth_with_pressure: {
      action:
        "Balance growth with stronger destination monitoring",
      explanation:
        "Growth signals are present alongside relatively higher tourism pressure. Expansion should be paired with closer monitoring of the pressure drivers.",
    },

    pressure_monitoring_priority: {
      action:
        "Prioritise monitoring before further demand stimulation",
      explanation:
        "The state shows relatively stronger monitoring-pressure signals. Review tourism intensity, growth and digital-interest momentum before increasing promotion.",
    },

    developing_or_early_signal: {
      action:
        "Monitor emerging indicators and strengthen evidence",
      explanation:
        "Signals are still developing. Continue monitoring tourism demand, spending and digital-interest indicators before committing to larger interventions.",
    },
  };

  return (
    guidance[pattern] ?? {
      action: "Continue monitoring tourism indicators",
      explanation:
        "Review the available opportunity, pressure and forecast signals before making a tourism-development decision.",
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
        "Investigate for targeted support and destination development",
      explanation:
        "This district combines a relatively strong digital emerging signal with higher development-support context. Further local feasibility assessment is recommended.",
    },

    rising_digital_interest: {
      action:
        "Monitor rising digital interest and validate local tourism readiness",
      explanation:
        "Digital momentum is relatively strong. Validate infrastructure, tourism products and local capacity before translating the signal into promotional action.",
    },

    development_context_monitoring: {
      action:
        "Focus on development context and tourism readiness",
      explanation:
        "Development-support needs are relatively higher while digital momentum is not among the strongest signals. Consider enabling conditions before demand stimulation.",
    },

    stable_or_lower_digital_signal: {
      action:
        "Maintain observation rather than aggressive intervention",
      explanation:
        "The current digital signal is relatively stable or lower. Continue monitoring changes over time before escalating tourism-development activity.",
    },

    insufficient_digital_variation: {
      action:
        "Do not infer tourism momentum from the available digital series",
      explanation:
        "The Google Trends series does not contain enough variation for a reliable digital emerging-signal score.",
    },

    digital_signal_only_context_incomplete: {
      action:
        "Use the digital signal cautiously until context data improves",
      explanation:
        "A digital signal is available, but socioeconomic context is incomplete. Avoid making a development-support interpretation from incomplete evidence.",
    },
  };

  return (
    guidance[category] ?? {
      action: "Continue monitoring available indicators",
      explanation:
        "Use the supplied digital and development-context indicators together with local evidence.",
    }
  );
}

function confidenceStyle(
  confidence: "high" | "medium" | "low"
) {
  if (confidence === "high") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (confidence === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
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
            item.signal_category ===
              "emerging_signal_support_priority" ||
            item.signal_category ===
              "rising_digital_interest"
        )
        .sort((a, b) => {
          if (
            a.digital_emerging_signal_score === null &&
            b.digital_emerging_signal_score === null
          ) {
            return 0;
          }

          if (a.digital_emerging_signal_score === null) {
            return 1;
          }

          if (b.digital_emerging_signal_score === null) {
            return -1;
          }

          return (
            b.digital_emerging_signal_score -
            a.digital_emerging_signal_score
          );
        })
        .slice(0, 8),
    [districts]
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
              Select a state to translate model signals into
              monitoring guidance
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
          value={selected.opportunity_score.toFixed(1)}
          description="Relative composite indicator"
        />

        <MetricCard
          title="Pressure Score"
          value={selected.pressure_score.toFixed(1)}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold tracking-wider text-[#F59E0B]">
            SUGGESTED DECISION DIRECTION
          </p>

          <h3 className="mt-3 text-2xl font-bold text-[#14263D]">
            {stateRecommendation.action}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {stateRecommendation.explanation}
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-semibold text-slate-500">
              Evidence to review
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </div>

        <div className="rounded-2xl border border-amber-200 bg-[#FFF7E6] p-6">
          <p className="text-xs font-bold tracking-wider text-[#92400E]">
            INTERPRETATION
          </p>

          <h3 className="mt-3 text-lg font-bold text-[#92400E]">
            Decision support, not an automatic policy decision
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#92400E]">
            These recommendations are interface-level guidance
            derived from the supplied classification and leading
            drivers. The scores are relative indicators and should
            be combined with local capacity, infrastructure,
            environmental and stakeholder evidence before action.
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
          Districts with emerging digital signals are surfaced for
          further investigation, not ranked as the best tourism
          destinations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {priorityDistricts.map((district) => {
          const guidance =
            districtGuidance(
              district.signal_category
            );

          return (
            <div
              key={district.series_id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#F59E0B]">
                    {district.state}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-[#14263D]">
                    {district.canonical_district}
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
                    district.data_confidence.slice(1)}{" "}
                  confidence
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-[#1E3A5F]">
                {districtCategoryLabel(
                  district.signal_category
                )}
              </p>

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

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Leading signal components
                </p>

                <p className="mt-2 text-sm font-medium text-[#14263D]">
                  {district.leading_signal_components}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-[#14263D]">
          Important limitation
        </p>

        <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-500">
          Google Trends is used as a digital-interest proxy. Its
          index is normalized independently for each series, so
          these district signals describe relative momentum rather
          than absolute search volume or confirmed tourist demand.
        </p>
      </div>
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

      <p className="mt-2 text-xl font-bold capitalize text-[#14263D]">
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