"use client";

import { useMemo, useState } from "react";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StateIntelligenceRecord = {
  state: string;
  tourism_data_year: number;

  domestic_visitors: number;
  tourism_receipts_rm: number;

  latest_trend_index: number;
  forecast_trend_index: number;
  forecast_change_points: number;
  forecast_month: string;
  forecast_method: string;
  model_version: string;
  forecast_momentum_pct: number;

  opportunity_score: number;
  pressure_score: number;

  decision_pattern: string;

  top_opportunity_driver: string;
  top_pressure_driver: string;

  visitor_growth_score: number;
  spending_value_score: number;
  forecast_momentum_score: number;
  search_growth_score: number;
  tourism_headroom_score: number;
  development_context_score: number;
};

type Props = {
  data: StateIntelligenceRecord[];
};

function formatDecisionPattern(value: string) {
  const labels: Record<string, string> = {
    emerging_opportunity: "Emerging Opportunity",
    growth_with_pressure: "Growth with Pressure",
    pressure_monitoring_priority: "Pressure Monitoring Priority",
    developing_or_early_signal: "Developing / Early Signal",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}

function formatMethod(value: string) {
  if (value === "catboost_residual_hybrid") {
    return "Three-month mean + CatBoost residual correction";
  }

  return value.replaceAll("_", " ");
}

function formatForecastMonth(value: string) {
  const [year, month] = value.slice(0, 7).split("-");

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

  return `${months[Number(month) - 1]} ${year}`;
}

function formatSignedPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatScore(value: number) {
  return value.toFixed(1);
}

type TooltipEntry = {
  payload?: StateIntelligenceRecord;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
};

function CustomTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  return (
    <div className="min-w-56 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="font-semibold text-[#14263D]">
        {item.state}
      </p>

      <div className="mt-3 space-y-2 text-sm">
        <p className="text-slate-500">
          Opportunity:
          <span className="ml-2 font-semibold text-[#1E3A5F]">
            {formatScore(item.opportunity_score)}
          </span>
        </p>

        <p className="text-slate-500">
          Pressure:
          <span className="ml-2 font-semibold text-[#1E3A5F]">
            {formatScore(item.pressure_score)}
          </span>
        </p>

        <p className="border-t border-slate-100 pt-2 text-xs text-slate-500">
          {formatDecisionPattern(item.decision_pattern)}
        </p>
      </div>
    </div>
  );
}

export default function StateIntelligenceDashboard({
  data,
}: Props) {
  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.state.localeCompare(b.state)
      ),
    [data]
  );

  const [selectedState, setSelectedState] =
    useState(sortedData[0]?.state ?? "");

  const selected = useMemo(
    () =>
      sortedData.find(
        (item) => item.state === selectedState
      ) ?? sortedData[0],
    [selectedState, sortedData]
  );

  if (!selected) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        Tourism intelligence data is currently unavailable.
      </div>
    );
  }

  const selectedScatter = sortedData.filter(
    (item) => item.state === selected.state
  );

  const otherScatter = sortedData.filter(
    (item) => item.state !== selected.state
  );

  return (
    <div>
      {/* STATE SELECTOR */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#14263D]">
              Select State
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Explore ML-derived state tourism intelligence
            </p>
          </div>

          <select
            value={selectedState}
            onChange={(event) =>
              setSelectedState(event.target.value)
            }
            className="min-w-64 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none transition focus:border-[#F59E0B]"
          >
            {sortedData.map((item) => (
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

      {/* SELECTED STATE HEADER */}

      <div className="mt-6 rounded-2xl bg-[#1E3A5F] p-6 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#FBBF24]">
              STATE TOURISM INTELLIGENCE
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {selected.state}
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              {formatDecisionPattern(
                selected.decision_pattern
              )}
            </p>
          </div>

          <div className="text-sm text-slate-300">
            Tourism data:{" "}
            <span className="font-medium text-white">
              {selected.tourism_data_year}
            </span>
          </div>
        </div>
      </div>

      {/* SCORE CARDS */}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ScoreCard
          title="Opportunity Score"
          value={formatScore(
            selected.opportunity_score
          )}
          description="Relative composite indicator across Malaysian states"
        />

        <ScoreCard
          title="Pressure Score"
          value={formatScore(
            selected.pressure_score
          )}
          description="Relative tourism monitoring pressure"
        />

        <ScoreCard
          title="Forecast Search Interest"
          value={selected.forecast_trend_index.toFixed(
            1
          )}
          description={formatForecastMonth(
            selected.forecast_month
          )}
        />

        <ScoreCard
          title="Forecast Momentum"
          value={formatSignedPercent(
            selected.forecast_momentum_pct
          )}
          description="Change from latest observed search-interest index"
        />
      </div>

      {/* OPPORTUNITY VS PRESSURE */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <div className="mb-3 h-1 w-10 rounded-full bg-[#F59E0B]" />

          <h3 className="text-lg font-semibold text-[#14263D]">
            Opportunity vs Tourism Pressure
          </h3>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            Compare relative tourism opportunity and monitoring-pressure
            indicators across Malaysia&apos;s 16 states and federal
            territories.
          </p>
        </div>

        <div className="mt-6 h-[480px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <ScatterChart
              margin={{
                top: 20,
                right: 25,
                bottom: 25,
                left: 10,
              }}
            >
              <CartesianGrid
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />

              <XAxis
                type="number"
                dataKey="opportunity_score"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                label={{
                  value: "Opportunity Score",
                  position: "insideBottom",
                  offset: -12,
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <YAxis
                type="number"
                dataKey="pressure_score"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                width={60}
                label={{
                  value: "Pressure Score",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  strokeDasharray: "4 4",
                }}
              />

              <Scatter
                data={otherScatter}
                fill="#1E3A5F"
              />

              <Scatter
                data={selectedScatter}
                fill="#F97316"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <p className="text-xs leading-5 text-slate-400">
            Scores are relative analytical indicators, not probabilities.
          </p>

          <div className="flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E3A5F]" />
              Other states
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
              Selected state
            </div>
          </div>
        </div>
      </div>

      {/* FORECAST + DRIVERS */}

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold tracking-wider text-[#F59E0B]">
            NEXT-MONTH DIGITAL INTEREST
          </p>

          <h3 className="mt-3 text-xl font-bold text-[#14263D]">
            Search Interest Forecast
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <MiniMetric
              label="Latest Observed Index"
              value={selected.latest_trend_index.toFixed(
                1
              )}
            />

            <MiniMetric
              label="Forecast Index"
              value={selected.forecast_trend_index.toFixed(
                1
              )}
            />

            <MiniMetric
              label="Change in Points"
              value={`${selected.forecast_change_points > 0 ? "+" : ""}${selected.forecast_change_points.toFixed(
                1
              )}`}
            />

            <MiniMetric
              label="Forecast Month"
              value={formatForecastMonth(
                selected.forecast_month
              )}
            />
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Forecast method
            </p>

            <p className="mt-2 text-sm font-medium text-[#14263D]">
              {formatMethod(
                selected.forecast_method
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Model version: {selected.model_version}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold tracking-wider text-[#F59E0B]">
            LEADING DRIVERS
          </p>

          <h3 className="mt-3 text-xl font-bold text-[#14263D]">
            What is driving the scores?
          </h3>

          <DriverCard
            label="Opportunity"
            value={selected.top_opportunity_driver}
          />

          <DriverCard
            label="Pressure"
            value={selected.top_pressure_driver}
          />

          <div className="mt-5 rounded-xl border border-amber-100 bg-[#FFF7E6] p-4">
            <p className="text-sm font-medium text-[#92400E]">
              Interpretation note
            </p>

            <p className="mt-2 text-xs leading-5 text-[#92400E]">
              Opportunity and pressure are relative composite indicators.
              They should support comparison and monitoring, not be interpreted
              as investment return, environmental damage, or probability of
              tourism success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type ScoreCardProps = {
  title: string;
  value: string;
  description: string;
};

function ScoreCard({
  title,
  value,
  description,
}: ScoreCardProps) {
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

type MiniMetricProps = {
  label: string;
  value: string;
};

function MiniMetric({
  label,
  value,
}: MiniMetricProps) {
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

type DriverCardProps = {
  label: string;
  value: string;
};

function DriverCard({
  label,
  value,
}: DriverCardProps) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-500">
        {label} driver
      </p>

      <p className="mt-2 text-lg font-semibold capitalize text-[#1E3A5F]">
        {value}
      </p>
    </div>
  );
}