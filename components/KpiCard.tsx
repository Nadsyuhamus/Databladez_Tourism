type KpiCardProps = {
  title: string;
  value: string;
  description: string;
};

export default function KpiCard({
  title,
  value,
  description,
}: KpiCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 h-1 w-10 rounded-full bg-[#F59E0B]" />

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-[#14263D]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}