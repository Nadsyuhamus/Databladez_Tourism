"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-6 md:flex">
        <Brand />

        <nav className="mt-10 space-y-2">
          {navigation.map((item) => (
            <NavigationLink
              key={item.name}
              name={item.name}
              href={item.href}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-5">
          <p className="text-xs leading-5 text-slate-400">
            Sustainable Tourism Intelligence
            <br />
            DOSM Datathon 2026
          </p>
        </div>
      </aside>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm md:hidden"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-5 rounded bg-[#1E3A5F]" />
          <span className="block h-0.5 w-5 rounded bg-[#1E3A5F]" />
          <span className="block h-0.5 w-5 rounded bg-[#1E3A5F]" />
        </span>
      </button>

      {/* MOBILE BRAND */}
      <div className="fixed left-16 top-4 z-30 flex h-11 items-center md:hidden">
        <div>
          <p className="text-sm font-bold text-[#1E3A5F]">
            Databladez
          </p>

          <p className="text-[10px] font-medium tracking-wide text-slate-400">
            Gliding Across Malaysia
          </p>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* DARK BACKDROP */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/35"
          />

          {/* DRAWER */}
          <aside className="relative flex h-full w-[82%] max-w-80 flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <Brand />

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-500 transition hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navigation.map((item) => (
                <NavigationLink
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  active={isActive(item.href)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                Sustainable Tourism Intelligence
                <br />
                DOSM Datathon 2026
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F] shadow-sm">
        <RollerbladeMark />
      </div>

      <div className="min-w-0">
        <h1 className="text-xl font-bold leading-tight text-[#1E3A5F]">
          Databladez
        </h1>

        <p className="mt-0.5 whitespace-nowrap text-[11px] font-medium tracking-wide text-slate-500">
          Gliding Across Malaysia
        </p>
      </div>
    </div>
  );
}

function RollerbladeMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 12h18c3.5 0 6.5 2.4 7.3 5.8l4.2 17.2H20.2L15 20.5A6.3 6.3 0 0 1 18 12Z"
        fill="white"
      />
      <path
        d="M17.5 35h32.2c2.2 0 4.1 1.8 4.1 4.1v2.3H14v-3.2c0-1.8 1.5-3.2 3.5-3.2Z"
        fill="#F59E0B"
      />
      <path
        d="M21 19h17"
        stroke="#1E3A5F"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M26 12v12"
        stroke="#1E3A5F"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M34 12v12"
        stroke="#1E3A5F"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="48" r="4.5" fill="white" />
      <circle cx="34" cy="48" r="4.5" fill="white" />
      <circle cx="46" cy="48" r="4.5" fill="white" />
    </svg>
  );
}

function NavigationLink({
  name,
  href,
  active,
  onClick,
}: {
  name: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "flex items-center rounded-xl bg-[#EAF0F6] px-4 py-3 font-medium text-[#1E3A5F]"
          : "flex items-center rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-[#1E3A5F]"
      }
    >
      <span
        className={
          active
            ? "mr-3 h-2 w-2 shrink-0 rounded-full bg-[#F59E0B]"
            : "mr-3 h-2 w-2 shrink-0 rounded-full bg-transparent"
        }
      />

      {name}
    </Link>
  );
}
