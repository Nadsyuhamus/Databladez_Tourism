"use client";

import { useState } from "react";

type DistrictRecord = {
    series_id: string;
    state: string;
    area: string;
    canonical_district: string;

    mapping_confidence: "high" | "medium";

    latest_observed_month: string;
    latest_observed_trend: number;

    forecast_month: string;
    forecast_trend_index: number;
    forecast_method: string;

    short_term_change_pct: number;
    annual_change_pct: number;
    normalized_12m_slope_pct: number;
    projected_change_pct: number;

    digital_emerging_signal_score: number | null;

    population_000: number | null;
    population_000_year: number | null;

    income_median: number | null;
    income_median_year: number | null;

    poverty: number | null;
    poverty_year: number | null;

    u_rate: number | null;
    u_rate_year: number | null;

    context_component_count: number;

    development_support_context_score:
    | number
    | null;

    signal_quality: string;
    signal_category: string;

    leading_signal_components: string;

    data_confidence: "high" | "medium" | "low";
};

type Props = {
    data: DistrictRecord[];
};

function escapeCsv(
    value: string | number | null
) {
    if (value === null) {
        return "";
    }

    const text = String(value);

    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n")
    ) {
        return `"${text.replaceAll(
            '"',
            '""'
        )}"`;
    }

    return text;
}

function formatScore(
    value: number | null
) {
    if (value === null) {
        return "Unavailable";
    }

    return value.toFixed(1);
}

function categoryLabel(value: string) {
    const labels: Record<string, string> = {
        emerging_signal_support_priority:
            "Emerging Signal + Support Priority",

        rising_digital_interest:
            "Rising Digital Interest",

        development_context_monitoring:
            "Development Context Monitoring",

        stable_or_lower_digital_signal:
            "Stable or Lower Digital Signal",

        insufficient_digital_variation:
            "Insufficient Digital Variation",

        digital_signal_only_context_incomplete:
            "Digital Signal Available — Context Incomplete",
    };

    return (
        labels[value] ??
        value.replaceAll("_", " ")
    );
}

function confidenceLabel(value: string) {
    return `${value
        .charAt(0)
        .toUpperCase()}${value.slice(1)}`;
}

export default function DistrictCsvDownloadButton({
    data,
}: Props) {
    const [previewOpen, setPreviewOpen] =
        useState(false);

    function downloadCsv() {
        if (data.length === 0) {
            return;
        }

        const headers = [
            "Series ID",
            "State",
            "District",
            "Search Area Label",
            "Digital Emerging Signal Score",
            "Development Support Context Score",
            "Signal Category",
            "Data Confidence",
            "Signal Quality",
            "Mapping Confidence",
            "Forecast Month",
            "Forecast Search Interest Index",
            "Forecast Method",
            "3-Month Change (%)",
            "12-Month Change (%)",
            "12-Month Normalized Slope (%)",
            "Projected Change (%)",
            "Leading Signal Components",
        ];

        const rows = data.map((item) => [
            item.series_id,
            item.state,
            item.canonical_district,
            item.area,

            item.digital_emerging_signal_score,
            item.development_support_context_score,

            item.signal_category,
            item.data_confidence,
            item.signal_quality,
            item.mapping_confidence,

            item.forecast_month,
            item.forecast_trend_index,
            item.forecast_method,

            item.short_term_change_pct,
            item.annual_change_pct,
            item.normalized_12m_slope_pct,
            item.projected_change_pct,

            item.leading_signal_components,
        ]);

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) =>
                        escapeCsv(value)
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "databladez-filtered-district-signals.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setPreviewOpen(false);
    }

    return (
        <>
            {/* PREVIEW BUTTON */}

            <button
                type="button"
                onClick={() =>
                    setPreviewOpen(true)
                }
                disabled={data.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-[#FFF7E6] px-4 py-2.5 text-xs font-semibold text-[#92400E] transition hover:bg-[#FFF3D6] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <path
                        d="M2.8 12s3.3-5 9.2-5 9.2 5 9.2 5-3.3 5-9.2 5-9.2-5-9.2-5Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="2.3"
                    />
                </svg>

                Preview CSV
                <span className="font-normal opacity-70">
                    ({data.length})
                </span>
            </button>

            {/* PREVIEW MODAL */}

            {previewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* BACKDROP */}

                    <button
                        type="button"
                        aria-label="Close CSV preview"
                        onClick={() =>
                            setPreviewOpen(false)
                        }
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"
                    />

                    {/* MODAL */}

                    <div className="relative z-10 flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        {/* HEADER */}

                        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-[#B45309]">
                                    CSV PREVIEW
                                </p>

                                <h3 className="mt-1 text-xl font-bold text-[#14263D]">
                                    District Signal Export
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {data.length} filtered{" "}
                                    {data.length === 1
                                        ? "record"
                                        : "records"}{" "}
                                    will be downloaded.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setPreviewOpen(false)
                                }
                                aria-label="Close preview"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-500 transition hover:bg-slate-50"
                            >
                                ×
                            </button>
                        </div>

                        {/* PREVIEW TABLE */}

                        <div className="flex-1 overflow-auto">
                            <table className="w-full min-w-[950px] text-left text-xs">
                                <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <PreviewHeader>
                                            District
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            State
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            Digital Signal
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            Development Context
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            Category
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            Confidence
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            Forecast Month
                                        </PreviewHeader>

                                        <PreviewHeader>
                                            Forecast Index
                                        </PreviewHeader>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((item) => (
                                        <tr
                                            key={item.series_id}
                                            className="border-b border-slate-100 last:border-b-0"
                                        >
                                            <PreviewCell>
                                                <p className="font-semibold text-[#14263D]">
                                                    {
                                                        item.canonical_district
                                                    }
                                                </p>

                                                {item.area !==
                                                    item.canonical_district && (
                                                        <p className="mt-1 text-[10px] text-slate-400">
                                                            Search label:{" "}
                                                            {item.area}
                                                        </p>
                                                    )}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {item.state}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {formatScore(
                                                    item.digital_emerging_signal_score
                                                )}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {formatScore(
                                                    item.development_support_context_score
                                                )}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {categoryLabel(
                                                    item.signal_category
                                                )}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {confidenceLabel(
                                                    item.data_confidence
                                                )}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {item.forecast_month.slice(
                                                    0,
                                                    7
                                                )}
                                            </PreviewCell>

                                            <PreviewCell>
                                                {item.forecast_trend_index.toFixed(
                                                    1
                                                )}
                                            </PreviewCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setPreviewOpen(false)
                                }
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={downloadCsv}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14263D]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 3v12"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="m7.5 11 4.5 4.5 4.5-4.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M5 20h14"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                Download CSV ({data.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function PreviewHeader({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {children}
        </th>
    );
}

function PreviewCell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <td className="px-4 py-3 align-top leading-5 text-slate-600">
            {children}
        </td>
    );
}