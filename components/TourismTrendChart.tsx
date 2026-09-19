"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TourismTrendData = {
  year: number;
  visitors: number;
};

type TourismTrendChartProps = {
  data: TourismTrendData[];
};

export default function TourismTrendChart({
  data,
}: TourismTrendChartProps) {
  const latestData = data[data.length - 1];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 h-1 w-10 rounded-full bg-[#F59E0B]" />

          <h3 className="text-lg font-semibold text-[#14263D]">
            Domestic Tourism Trend
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Total domestic visitors in Malaysia, 2019–2025
          </p>
        </div>

        <div className="rounded-full bg-[#FFF7E6] px-3 py-1 text-xs font-semibold text-[#B45309]">
          Latest: {latestData?.visitors.toFixed(1)}M
        </div>
      </div>

      {/* Chart */}

      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 24,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `${value}M`
              }
            />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(1)}M`,
                "Domestic Visitors",
              ]}
              labelFormatter={(label) =>
                `Year ${label}`
              }
              contentStyle={{
                borderRadius: "12px",
                border:
                  "1px solid #E2E8F0",
                boxShadow:
                  "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#1E3A5F"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#1E3A5F",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                fill: "#F59E0B",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />

            {latestData && (
              <ReferenceDot
                x={latestData.year}
                y={latestData.visitors}
                r={7}
                fill="#F97316"
                stroke="#FFFFFF"
                strokeWidth={3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Source: Department of Statistics Malaysia (DOSM),
          Domestic Tourism Survey, annual releases
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[#F97316]" />
          Latest year
        </div>
      </div>
    </div>
  );
}