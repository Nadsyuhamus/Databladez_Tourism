"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StateComparisonData = {
  state: string;
  visitors: number;
};

type StateComparisonChartProps = {
  data: StateComparisonData[];
};

export default function StateComparisonChart({
  data,
}: StateComparisonChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div>
        <div className="mb-3 h-1 w-10 rounded-full bg-[#F59E0B]" />

        <h3 className="text-lg font-semibold text-[#14263D]">
          Top States by Domestic Visitors
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Domestic visitor volume across Malaysia&apos;s leading destinations,
          2025
        </p>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[430px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 35,
              left: 35,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              horizontal={false}
            />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) => `${value}M`}
            />

            <YAxis
              type="category"
              dataKey="state"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#475569",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{
                fill: "#F8FAFC",
              }}
              formatter={(value) => [
                `${Number(value).toFixed(1)}M`,
                "Domestic Visitors",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />

            <Bar
              dataKey="visitors"
              radius={[0, 6, 6, 0]}
              barSize={26}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.state}-${index}`}
                  fill={
                    entry.state === "Selangor"
                      ? "#F97316"
                      : "#1E3A5F"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Source: Datathon state comparison dataset
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F97316]" />
            Highest visitor volume
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1E3A5F]" />
            Other leading states
          </div>
        </div>
      </div>
    </div>
  );
}