"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

type IconName =
  | "overview"
  | "explore"
  | "ai"
  | "recommendations"
  | "methodology";

const navigation: {
  name: string;
  href: string;
  icon: IconName;
}[] = [
  {
    name: "Overview",
    href: "/",
    icon: "overview",
  },
  {
    name: "Explore",
    href: "/explore",
    icon: "explore",
  },
  {
    name: "AI Insights",
    href: "/ai-insights",
    icon: "ai",
  },
  {
    name: "Recommendations",
    href: "/recommendations",
    icon: "recommendations",
  },
  {
    name: "Methodology",
    href: "/methodology",
    icon: "methodology",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [
    desktopCollapsed,
    setDesktopCollapsed,
  ] = useState(false);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(
        "databladez-sidebar-collapsed"
      );

    if (stored === "true") {
      setDesktopCollapsed(true);
    }
  }, []);

  function toggleDesktopSidebar() {
    setDesktopCollapsed((current) => {
      const next = !current;

      window.localStorage.setItem(
        "databladez-sidebar-collapsed",
        String(next)
      );

      return next;
    });
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ================================
          DESKTOP VERTICAL TAB SIDEBAR
      ================================= */}

      <aside
        className={`relative hidden min-h-screen shrink-0 flex-col overflow-visible border-r border-slate-200 bg-white transition-[width,padding] duration-300 md:flex ${
          desktopCollapsed
            ? "w-[76px] px-3 py-5"
            : "w-64 p-5"
        }`}
      >
        {/* HEADER */}

        <div
          className={`flex ${
            desktopCollapsed
              ? "flex-col items-center gap-4"
              : "items-center justify-between gap-3"
          }`}
        >
          <Brand
            collapsed={desktopCollapsed}
          />

          <button
            type="button"
            onClick={toggleDesktopSidebar}
            aria-label={
              desktopCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              desktopCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#1E3A5F]"
          >
            <ChevronIcon
              direction={
                desktopCollapsed
                  ? "right"
                  : "left"
              }
            />
          </button>
        </div>

        {/* TAB LIST */}

        <nav
          className={
            desktopCollapsed
              ? "mt-7 space-y-1.5"
              : "mt-8 space-y-1.5"
          }
        >
          {navigation.map((item) => (
            <NavigationTab
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              active={isActive(
                item.href
              )}
              collapsed={
                desktopCollapsed
              }
            />
          ))}
        </nav>

        {/* FOOTER */}

        <div className="mt-auto">
          {!desktopCollapsed ? (
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                Sustainable Tourism
                Intelligence
                <br />
                DOSM Datathon 2026
              </p>
            </div>
          ) : (
            <div className="flex justify-center border-t border-slate-100 pt-5">
              <span
                className="h-2 w-2 rounded-full bg-[#F59E0B]"
                title="DOSM Datathon 2026"
              />
            </div>
          )}
        </div>
      </aside>

      {/* ================================
          MOBILE BUTTON
      ================================= */}

      <button
        type="button"
        onClick={() =>
          setMobileOpen(true)
        }
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

      {/* ================================
          MOBILE DRAWER
      ================================= */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileOpen(false)
            }
            className="absolute inset-0 bg-slate-950/35"
          />

          <aside className="relative flex h-full w-[82%] max-w-80 flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <Brand />

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                aria-label="Close navigation menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-500 transition hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navigation.map(
                (item) => (
                  <NavigationTab
                    key={item.name}
                    name={
                      item.name
                    }
                    href={
                      item.href
                    }
                    icon={
                      item.icon
                    }
                    active={isActive(
                      item.href
                    )}
                    collapsed={false}
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                  />
                )
              )}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                Sustainable Tourism
                Intelligence
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

/* ====================================
   BRAND
==================================== */

function Brand({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F] shadow-sm">
        <RollerbladeMark />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-[#1E3A5F]">
            Databladez
          </h1>

          <p className="mt-0.5 whitespace-nowrap text-[11px] font-medium tracking-wide text-slate-500">
            Gliding Across Malaysia
          </p>
        </div>
      )}
    </div>
  );
}

/* ====================================
   VERTICAL TAB
==================================== */

function NavigationTab({
  name,
  href,
  icon,
  active,
  collapsed,
  onClick,
}: {
  name: string;
  href: string;
  icon: IconName;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  if (collapsed) {
    return (
      <div className="group relative">
        <Link
          href={href}
          onClick={onClick}
          aria-current={
            active
              ? "page"
              : undefined
          }
          aria-label={name}
          className={`relative flex h-11 w-full items-center justify-center rounded-xl transition ${
            active
              ? "bg-[#EAF0F6] text-[#1E3A5F]"
              : "text-slate-500 hover:bg-slate-100 hover:text-[#1E3A5F]"
          }`}
        >
          <NavigationIcon
            icon={icon}
          />

          {active && (
            <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-[#F59E0B]" />
          )}
        </Link>

        {/* CHROME-LIKE HOVER TITLE */}

        <div className="pointer-events-none absolute left-full top-1/2 z-[100] ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#14263D] opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100">
          {name}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={
        active
          ? "page"
          : undefined
      }
      className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "bg-[#EAF0F6] font-semibold text-[#1E3A5F]"
          : "text-slate-600 hover:bg-slate-100 hover:text-[#1E3A5F]"
      }`}
    >
      {active && (
        <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-[#F59E0B]" />
      )}

      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        <NavigationIcon
          icon={icon}
        />
      </span>

      <span className="truncate">
        {name}
      </span>
    </Link>
  );
}

/* ====================================
   NAVIGATION ICONS
==================================== */

function NavigationIcon({
  icon,
}: {
  icon: IconName;
}) {
  const common =
    "h-[19px] w-[19px]";

  if (icon === "overview") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={common}
        aria-hidden="true"
      >
        <path
          d="M3.5 10.5 12 3l8.5 7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M5.5 9.5V21h13V9.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M9.5 21v-6h5v6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "explore") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={common}
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
        />

        <path
          d="m15.8 8.2-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "ai") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={common}
        aria-hidden="true"
      >
        <path
          d="M12 2.8c.5 3.6 2.4 5.5 6 6-3.6.5-5.5 2.4-6 6-.5-3.6-2.4-5.5-6-6 3.6-.5 5.5-2.4 6-6Z"
          strokeLinejoin="round"
        />

        <path
          d="M18.5 15.5c.25 1.8 1.2 2.75 3 3-1.8.25-2.75 1.2-3 3-.25-1.8-1.2-2.75-3-3 1.8-.25 2.75-1.2 3-3Z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "recommendations") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={common}
        aria-hidden="true"
      >
        <path
          d="M9 18h6"
          strokeLinecap="round"
        />

        <path
          d="M10 21h4"
          strokeLinecap="round"
        />

        <path
          d="M8.2 14.8c-1.3-1.1-2.1-2.7-2.1-4.5A5.9 5.9 0 0 1 12 4.4a5.9 5.9 0 0 1 5.9 5.9c0 1.8-.8 3.4-2.1 4.5-.8.7-1.3 1.3-1.5 2.2H9.7c-.2-.9-.7-1.5-1.5-2.2Z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={common}
      aria-hidden="true"
    >
      <path
        d="M6 3.5h9l3 3V20.5H6V3.5Z"
        strokeLinejoin="round"
      />

      <path
        d="M15 3.5v3h3"
        strokeLinejoin="round"
      />

      <path
        d="M9 11h6M9 14.5h6M9 18h4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ====================================
   CHEVRON
==================================== */

function ChevronIcon({
  direction,
}: {
  direction: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d={
          direction === "left"
            ? "m14 6-6 6 6 6"
            : "m10 6 6 6-6 6"
        }
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ====================================
   BRAND MARK
==================================== */

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

      <circle
        cx="22"
        cy="48"
        r="4.5"
        fill="white"
      />

      <circle
        cx="34"
        cy="48"
        r="4.5"
        fill="white"
      />

      <circle
        cx="46"
        cy="48"
        r="4.5"
        fill="white"
      />
    </svg>
  );
}