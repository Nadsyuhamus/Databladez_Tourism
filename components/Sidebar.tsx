export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-6">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A5F] font-bold text-white">
            D
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#1E3A5F]">
              Databladez
            </h1>

            <p className="text-xs text-slate-500">
              Tourism Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-10 space-y-2">
        <div className="flex cursor-pointer items-center rounded-xl bg-[#EAF0F6] px-4 py-3 font-medium text-[#1E3A5F]">
          <span className="mr-3 h-2 w-2 rounded-full bg-[#F59E0B]" />
          Overview
        </div>

        <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-[#1E3A5F]">
          Explore
        </div>

        <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-[#1E3A5F]">
          AI Insights
        </div>

        <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-[#1E3A5F]">
          Recommendations
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-12 border-t border-slate-100 pt-5">
        <p className="text-xs leading-5 text-slate-400">
          Sustainable Tourism
          <br />
          Malaysia Datathon 2026
        </p>
      </div>
    </aside>
  );
}