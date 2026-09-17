export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-6">
      <h1 className="text-xl font-bold text-teal-700">
        Databladez
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Tourism Intelligence
      </p>

      <nav className="mt-10 space-y-2">
        <div className="rounded-lg bg-teal-50 px-4 py-3 font-medium text-teal-700">
          Overview
        </div>

        <div className="rounded-lg px-4 py-3 text-gray-600">
          Explore
        </div>

        <div className="rounded-lg px-4 py-3 text-gray-600">
          AI Insights
        </div>

        <div className="rounded-lg px-4 py-3 text-gray-600">
          Recommendations
        </div>
      </nav>
    </aside>
  );
}