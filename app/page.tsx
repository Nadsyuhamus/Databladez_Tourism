import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";

export default function Home() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8">
        <p className="text-sm font-medium text-teal-700">
          SUSTAINABLE TOURISM INTELLIGENCE
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Dashboard Overview
        </h2>

        <p className="mt-2 text-gray-500">
          Explore tourism trends, insights and sustainability indicators
          across Malaysia.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Visitors"
            value="--"
            description="Awaiting dataset"
          />

          <KpiCard
            title="Tourism Receipts"
            value="--"
            description="Awaiting dataset"
          />

          <KpiCard
            title="Average Stay"
            value="--"
            description="Awaiting dataset"
          />

          <KpiCard
            title="Sustainability Indicator"
            value="--"
            description="Awaiting dataset"
          />
        </div>
      </main>

    </div>
  );
}