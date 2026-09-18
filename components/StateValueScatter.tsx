"use client";

import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ScatterData = {
  state: string;
  visitors: number;
  spendingPerVisitor: number;
};

type StateValueScatterProps = {
  data: ScatterData[];
  selectedState: string;
};

function median(values: number[]) {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

type TooltipPayload = {
  payload?: ScatterData;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="font-semibold text-[#14263D]">
        {item.state}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Visitors:
        <span className="ml-2 font-medium text-[#14263D]">
          {item.visitors.toFixed(1)}M
        </span>
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Spend per visitor:
        <span className="ml-2 font-medium text-[#14263D]">
          RM{" "}
          {item.spendingPerVisitor.toLocaleString(
            "en-MY",
            {
              maximumFractionDigits: 0,
            }
          )}
        </span>
      </p>
    </div>
  );
}

export default function StateValueScatter({
  data,
  selectedState,
}: StateValueScatterProps) {
  const validData = data.filter(
    (item) =>
      Number.isFinite(item.visitors) &&
      Number.isFinite(
        item.spendingPerVisitor
      )
  );

  const visitorMedian = median(
    validData.map((item) => item.visitors)
  );

  const spendingMedian = median(
    validData.map(
      (item) => item.spendingPerVisitor
    )
  );

  const selectedData = validData.filter(
    (item) => item.state === selectedState
  );

  const otherData = validData.filter(
    (item) => item.state !== selectedState
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* HEADER */}

      <div>
        <div className="mb-3 h-1 w-10 rounded-full bg-[#F59E0B]" />

        <h3 className="text-lg font-semibold text-[#14263D]">
          Visitor Volume vs Tourism Value
        </h3>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Compare domestic visitor volume with
          average spending per visitor across
          Malaysian states.
        </p>
      </div>

      {/* CHART */}

      <div className="mt-6 h-[460px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ScatterChart
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 15,
            }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            <XAxis
              type="number"
              dataKey="visitors"
              name="Domestic Visitors"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `${value}M`
              }
              label={{
                value:
                  "Domestic Visitors (Million)",
                position: "insideBottom",
                offset: -10,
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <YAxis
              type="number"
              dataKey="spendingPerVisitor"
              name="Spend per Visitor"
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `RM${Math.round(value)}`
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                strokeDasharray: "4 4",
              }}
            />

            {/* MEDIAN REFERENCE LINES */}

            <ReferenceLine
              x={visitorMedian}
              stroke="#CBD5E1"
              strokeDasharray="5 5"
            />

            <ReferenceLine
              y={spendingMedian}
              stroke="#CBD5E1"
              strokeDasharray="5 5"
            />

            {/* OTHER STATES */}

            <Scatter
              name="Other States"
              data={otherData}
              fill="#1E3A5F"
            />

            {/* SELECTED STATE */}

            <Scatter
              name="Selected State"
              data={selectedData}
              fill="#F97316"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND / EXPLANATION */}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <p className="text-xs leading-5 text-slate-400">
          Dashed lines represent the median
          visitor volume and median spending per
          visitor across states.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
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
  );
}