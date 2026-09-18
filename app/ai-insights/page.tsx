import Sidebar from "@/components/Sidebar";

export default function AIInsightsPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8 lg:p-10">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />

            <p className="text-xs font-bold tracking-wider text-[#1E3A5F]">
              AI & MODEL INTELLIGENCE
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14263D]">
            AI Insights
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Explore model outputs, analytical findings and predictive
            intelligence generated from Malaysia tourism data.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-medium text-[#1E3A5F]">
            AI insights coming next
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Model results and explainability visualizations will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}