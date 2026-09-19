"use client";

import { useMemo, useState } from "react";
import StateValueScatter from "@/components/StateValueScatter";

type StateData = {
  state: string;
  year: number;
  visitors: number;
  receipts: number;
  spendingPerVisitor: number;
  tourismGrowth: number | null;
  tourismIntensity: number | null;
  searchInterest: number | null;
  opportunityPattern: string;
  pressurePattern: string;
};

type ExploreDashboardProps = {
  data: StateData[];
};

function formatVisitors(value: number) {
  return `${value.toFixed(1)}M`;
}

function formatReceipts(value: number) {
  return `RM ${value.toFixed(1)}B`;
}

function formatCurrency(value: number) {
  return `RM ${value.toLocaleString("en-MY", {
    maximumFractionDigits: 0,
  })}`;
}

function formatPercent(value: number | null) {
  if (value === null) return "N/A";

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatClassification(value: string) {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export default function ExploreDashboard({
  data,
}: ExploreDashboardProps) {
  const [selectedState, setSelectedState] =
    useState(data[0]?.state ?? "");

  const selectedData = useMemo(
    () =>
      data.find(
        (item) => item.state === selectedState
      ) ?? data[0],
    [data, selectedState]
  );

  if (!selectedData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        No state data available.
      </div>
    );
  }

  return (
    <div>
      {/* ==============================================
          STATE FILTER
      ============================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#14263D]">
              Select State
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Explore state-level tourism indicators
            </p>
          </div>

          <select
            value={selectedState}
            onChange={(event) =>
              setSelectedState(event.target.value)
            }
            className="min-w-60 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#14263D] outline-none transition focus:border-[#F59E0B]"
          >
            {data.map((item) => (
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

      {/* ==============================================
          STATE PROFILE HEADER
      ============================================== */}

      <div className="mt-6 rounded-2xl bg-[#1E3A5F] p-6 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#FBBF24]">
              STATE PROFILE
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {selectedData.state}
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Tourism performance in{" "}
              {selectedData.year}
            </p>
          </div>

          <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
            Malaysia Tourism Intelligence
          </div>
        </div>
      </div>

      {/* ==============================================
          PRIMARY KPI CARDS
      ============================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Domestic Visitors"
          value={formatVisitors(
            selectedData.visitors
          )}
          description={`${selectedData.state}, ${selectedData.year}`}
        />

        <MetricCard
          title="Tourism Receipts"
          value={formatReceipts(
            selectedData.receipts
          )}
          description={`${selectedData.state}, ${selectedData.year}`}
        />

        <MetricCard
          title="Spend per Visitor"
          value={formatCurrency(
            selectedData.spendingPerVisitor
          )}
          description="Average tourism value generated"
        />

        <MetricCard
          title="Tourism Growth"
          value={formatPercent(
            selectedData.tourismGrowth
          )}
          description="Year-on-year visitor growth"
        />
      </div>

      {/* ==============================================
          VALUE VS VOLUME CHART
      ============================================== */}

      <div className="mt-6">
        <StateValueScatter
          data={data.map((item) => ({
            state: item.state,
            visitors: item.visitors,
            spendingPerVisitor:
              item.spendingPerVisitor,
          }))}
          selectedState={selectedState}
        />
      </div>

      {/* ==============================================
          SECONDARY INDICATORS
      ============================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <IndicatorCard
          title="Tourism Intensity"
          value={
            selectedData.tourismIntensity === null
              ? "N/A"
              : selectedData.tourismIntensity.toFixed(
                  2
                )
          }
          description="Relative tourism activity indicator"
        />

        <IndicatorCard
          title="Google Search Interest"
          value={
            selectedData.searchInterest === null
              ? "N/A"
              : selectedData.searchInterest.toFixed(
                  1
                )
          }
          description="Digital interest proxy"
        />

        <IndicatorCard
          title="Pressure Pattern"
          value={
            selectedData.pressurePattern
              ? formatClassification(
                  selectedData.pressurePattern
                )
              : "Not classified"
          }
          description="Tourism pressure classification"
        />
      </div>

      {/* ==============================================
          INSIGHT PANELS
      ============================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InsightPanel
          eyebrow="OPPORTUNITY SIGNAL"
          title={
            selectedData.opportunityPattern
              ? formatClassification(
                  selectedData.opportunityPattern
                )
              : "No opportunity classification"
          }
          description="Pattern derived from the analytical dataset. Use this alongside visitor, value and demand indicators when assessing tourism development opportunities."
          tone="opportunity"
        />

        <InsightPanel
          eyebrow="PRESSURE SIGNAL"
          title={
            selectedData.pressurePattern
              ? formatClassification(
                  selectedData.pressurePattern
                )
              : "No pressure classification"
          }
          description="Highlights the state's tourism pressure pattern. Interpret this together with tourism intensity and visitor growth."
          tone="pressure"
        />
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  value: string;
  description: string;
};

function MetricCard({
  title,
  value,
  description,
}: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 h-1 w-10 rounded-full bg-[#F59E0B]" />

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-[#D97706]">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function IndicatorCard({
  title,
  value,
  description,
}: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="inline-flex rounded-full bg-[#FFF7E6] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#B45309]">
        INDICATOR
      </span>

      <h3 className="mt-3 text-sm font-semibold text-[#14263D]">
        {title}
      </h3>

      <p className="mt-3 text-xl font-bold text-[#B45309]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

type InsightPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  tone: "opportunity" | "pressure";
};

function InsightPanel({
  eyebrow,
  title,
  description,
  tone,
}: InsightPanelProps) {
  const isOpportunity =
    tone === "opportunity";

  return (
    <div
      className={
        isOpportunity
          ? "rounded-2xl border border-amber-200 bg-[#FFFCF7] p-6"
          : "rounded-2xl border border-orange-200 bg-[#FFF8F3] p-6"
      }
    >
      <span
        className={
          isOpportunity
            ? "inline-flex rounded-full bg-[#FFF3D6] px-3 py-1 text-[10px] font-bold tracking-wider text-[#92400E]"
            : "inline-flex rounded-full bg-[#FEECDC] px-3 py-1 text-[10px] font-bold tracking-wider text-[#9A3412]"
        }
      >
        {eyebrow}
      </span>

      <h3
        className={
          isOpportunity
            ? "mt-4 text-xl font-bold text-[#92400E]"
            : "mt-4 text-xl font-bold text-[#9A3412]"
        }
      >
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}