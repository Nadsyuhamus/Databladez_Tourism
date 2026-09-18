"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Overview",
    href: "/",
  },
  {
    name: "Explore",
    href: "/explore",
  },
  {
    name: "AI Insights",
    href: "/ai-insights",
  },
  {
    name: "Recommendations",
    href: "/recommendations",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-6">
      {/* Brand */}
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

      {/* Navigation */}
      <nav className="mt-10 space-y-2">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={
                isActive
                  ? "flex items-center rounded-xl bg-[#EAF0F6] px-4 py-3 font-medium text-[#1E3A5F]"
                  : "flex items-center rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-[#1E3A5F]"
              }
            >
              <span
                className={
                  isActive
                    ? "mr-3 h-2 w-2 rounded-full bg-[#F59E0B]"
                    : "mr-3 h-2 w-2 rounded-full bg-transparent"
                }
              />

              {item.name}
            </Link>
          );
        })}
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