"""
Generate EDA tables, report, and SVG graphics for the Malaysia tourism datathon.

Usage:
    python analysis/scripts/generate_eda.py \
        --input outputs/datathon_cleaned_all_files \
        --output outputs/datathon_eda_github

Dependencies:
    pandas, numpy

The chart output is SVG generated directly in Python, so this script does not
need matplotlib, seaborn, plotly, or any browser runtime.
"""

from __future__ import annotations

import argparse
import html
import json
import math
from pathlib import Path

import numpy as np
import pandas as pd


PALETTE = [
    "#1D4ED8",  # blue
    "#0F766E",  # teal
    "#B45309",  # amber
    "#BE123C",  # rose
    "#6D28D9",  # violet
    "#047857",  # green
    "#C2410C",  # orange
    "#0369A1",  # sky
    "#A21CAF",  # fuchsia
    "#4D7C0F",  # lime
]

BG = "#F6F8FB"
CARD = "#FFFFFF"
INK = "#111827"
MUTED = "#6B7280"
GRID = "#E5E7EB"
AXIS = "#94A3B8"


def fmt_num(value: float, decimals: int = 1) -> str:
    if pd.isna(value):
        return "n/a"
    return f"{value:,.{decimals}f}"


def fmt_pct(value: float, decimals: int = 1) -> str:
    if pd.isna(value):
        return "n/a"
    return f"{value:,.{decimals}f}%"


def safe_name(text: str) -> str:
    return (
        str(text)
        .lower()
        .replace(" ", "_")
        .replace(".", "")
        .replace("/", "_")
        .replace("(", "")
        .replace(")", "")
    )


def cagr(start: float, end: float, years: int) -> float:
    if pd.isna(start) or pd.isna(end) or start <= 0 or years <= 0:
        return np.nan
    return (end / start) ** (1 / years) - 1


def ensure_dirs(output_dir: Path) -> tuple[Path, Path]:
    tables_dir = output_dir / "tables"
    charts_dir = output_dir / "charts"
    tables_dir.mkdir(parents=True, exist_ok=True)
    charts_dir.mkdir(parents=True, exist_ok=True)
    return tables_dir, charts_dir


def svg_text(x: float, y: float, text: str, size: int = 12, anchor: str = "start", weight: str = "400", fill: str = INK) -> str:
    escaped = html.escape(str(text))
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-family="Inter, Segoe UI, Arial, sans-serif" text-anchor="{anchor}" font-weight="{weight}" fill="{fill}">{escaped}</text>'


def write_svg(path: Path, body: str, width: int, height: int) -> None:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<defs>
  <linearGradient id="canvas" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#F8FAFC"/>
    <stop offset="100%" stop-color="#EEF2F7"/>
  </linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.12"/>
  </filter>
</defs>
<rect width="100%" height="100%" fill="url(#canvas)"/>
{body}
</svg>
'''
    path.write_text(svg, encoding="utf-8")


def chart_shell(width: int, height: int, title: str, subtitle: str = "") -> list[str]:
    parts = [
        f'<rect x="24" y="24" width="{width - 48}" height="{height - 48}" rx="22" fill="{CARD}" filter="url(#shadow)"/>',
        svg_text(56, 66, title, 25, "start", "800", INK),
    ]
    if subtitle:
        parts.append(svg_text(56, 93, subtitle, 13, "start", "500", MUTED))
    return parts


def metric_label(value: float, suffix: str = "") -> str:
    if suffix == "%":
        return fmt_pct(value, 1)
    if suffix == "k":
        return f"{fmt_num(value, 1)}k"
    return f"{fmt_num(value, 1)}{suffix}"


def bar_chart(
    df: pd.DataFrame,
    label_col: str,
    value_col: str,
    title: str,
    output_path: Path,
    value_suffix: str = "",
    width: int = 1000,
    height: int = 640,
    top_n: int = 10,
    ascending: bool = False,
) -> None:
    data = df[[label_col, value_col]].dropna().sort_values(value_col, ascending=ascending).head(top_n).copy()
    if data.empty:
        return

    margin_left = 250
    margin_right = 120
    margin_top = 125
    margin_bottom = 70
    plot_w = width - margin_left - margin_right
    row_h = (height - margin_top - margin_bottom) / len(data)
    max_val = float(data[value_col].max())
    min_val = min(0.0, float(data[value_col].min()))
    span = max(max_val - min_val, 1e-9)
    zero_x = margin_left + ((0 - min_val) / span) * plot_w

    subtitle = f"Top {len(data)} states/federal territories, sorted by {value_col.replace('_', ' ')}"
    parts = chart_shell(width, height, title, subtitle)
    parts.append(f'<rect x="{margin_left - 10}" y="{margin_top - 18}" width="{plot_w + 20}" height="{height - margin_top - margin_bottom + 34}" rx="14" fill="#F8FAFC" stroke="#E5E7EB"/>')

    for tick in np.linspace(min_val, max_val, 5):
        tx = margin_left + ((tick - min_val) / span) * plot_w
        parts.append(f'<line x1="{tx:.1f}" y1="{margin_top - 10}" x2="{tx:.1f}" y2="{height - margin_bottom + 6}" stroke="{GRID}" stroke-width="1"/>')
        parts.append(svg_text(tx, height - margin_bottom + 28, metric_label(tick, value_suffix), 10, "middle", "500", MUTED))

    for i, (_, row) in enumerate(data.iterrows()):
        y = margin_top + i * row_h + 8
        label = row[label_col]
        val = float(row[value_col])
        x_val = margin_left + ((val - min_val) / span) * plot_w
        x = min(zero_x, x_val)
        w = abs(x_val - zero_x)
        color = PALETTE[i % len(PALETTE)]
        rank_color = "#EFF6FF" if i == 0 else "#F1F5F9"
        parts.append(f'<rect x="56" y="{y - 2:.1f}" width="34" height="{row_h * 0.62 + 4:.1f}" rx="9" fill="{rank_color}" stroke="#E2E8F0"/>')
        parts.append(svg_text(73, y + row_h * 0.43, str(i + 1), 12, "middle", "800", color))
        parts.append(svg_text(margin_left - 18, y + row_h * 0.43, label, 13, "end", "700", INK))
        parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 2):.1f}" height="{row_h * 0.58:.1f}" rx="8" fill="{color}" opacity="0.92"/>')
        parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w * 0.35, 1):.1f}" height="{row_h * 0.58:.1f}" rx="8" fill="#FFFFFF" opacity="0.13"/>')
        value_label = metric_label(val, value_suffix)
        parts.append(svg_text(max(x_val, zero_x) + 10, y + row_h * 0.40, value_label, 12, "start", "800", "#334155"))

    parts.append(f'<line x1="{zero_x:.1f}" y1="{margin_top - 14}" x2="{zero_x:.1f}" y2="{height - margin_bottom + 8}" stroke="{AXIS}" stroke-width="1.4"/>')
    parts.append(svg_text(width - 56, height - 36, "Source: cleaned DATATHON tables", 10, "end", "500", MUTED))
    write_svg(output_path, "\n".join(parts), width, height)


def line_chart(
    df: pd.DataFrame,
    x_col: str,
    y_col: str,
    group_col: str,
    title: str,
    output_path: Path,
    groups: list[str],
    width: int = 1000,
    height: int = 620,
) -> None:
    data = df[df[group_col].isin(groups)][[x_col, y_col, group_col]].dropna().copy()
    if data.empty:
        return

    margin_left = 100
    margin_right = 230
    margin_top = 125
    margin_bottom = 85
    plot_w = width - margin_left - margin_right
    plot_h = height - margin_top - margin_bottom

    xs = sorted(data[x_col].unique())
    y_min = min(0.0, float(data[y_col].min()))
    y_max = float(data[y_col].max())
    span = max(y_max - y_min, 1e-9)

    def sx(x):
        return margin_left + (xs.index(x) / max(len(xs) - 1, 1)) * plot_w

    def sy(y):
        return margin_top + plot_h - ((float(y) - y_min) / span) * plot_h

    parts = chart_shell(width, height, title, "Top visitor states, indexed by year")
    parts.append(f'<rect x="{margin_left}" y="{margin_top}" width="{plot_w}" height="{plot_h}" rx="16" fill="#F8FAFC" stroke="#E5E7EB"/>')

    for tick in np.linspace(y_min, y_max, 5):
        y = sy(tick)
        parts.append(f'<line x1="{margin_left}" y1="{y:.1f}" x2="{margin_left + plot_w}" y2="{y:.1f}" stroke="{GRID}"/>')
        parts.append(svg_text(margin_left - 10, y + 4, fmt_num(tick, 0), 11, "end", "500", MUTED))

    for x in xs:
        xp = sx(x)
        parts.append(f'<line x1="{xp:.1f}" y1="{margin_top + plot_h}" x2="{xp:.1f}" y2="{margin_top + plot_h + 6}" stroke="{AXIS}"/>')
        parts.append(svg_text(xp, margin_top + plot_h + 26, str(x), 11, "middle", "600", MUTED))

    for i, group in enumerate(groups):
        g = data[data[group_col] == group].sort_values(x_col)
        points = " ".join(f'{sx(row[x_col]):.1f},{sy(row[y_col]):.1f}' for _, row in g.iterrows())
        color = PALETTE[i % len(PALETTE)]
        parts.append(f'<polyline points="{points}" fill="none" stroke="{color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>')
        for _, row in g.iterrows():
            parts.append(f'<circle cx="{sx(row[x_col]):.1f}" cy="{sy(row[y_col]):.1f}" r="5.5" fill="{CARD}" stroke="{color}" stroke-width="3"/>')
        legend_y = margin_top + 10 + i * 30
        parts.append(f'<rect x="{margin_left + plot_w + 34}" y="{legend_y - 15}" width="142" height="22" rx="11" fill="#F8FAFC" stroke="#E2E8F0"/>')
        parts.append(f'<circle cx="{margin_left + plot_w + 48}" cy="{legend_y - 4}" r="5" fill="{color}"/>')
        parts.append(svg_text(margin_left + plot_w + 60, legend_y, group, 11, "start", "700", INK))

    parts.append(svg_text(width - 56, height - 36, "Source: state tourism cleaned data", 10, "end", "500", MUTED))
    write_svg(output_path, "\n".join(parts), width, height)


def scatter_chart(
    df: pd.DataFrame,
    x_col: str,
    y_col: str,
    label_col: str,
    title: str,
    output_path: Path,
    width: int = 1000,
    height: int = 680,
) -> None:
    data = df[[x_col, y_col, label_col]].dropna().copy()
    if data.empty:
        return

    margin_left = 105
    margin_right = 80
    margin_top = 125
    margin_bottom = 95
    plot_w = width - margin_left - margin_right
    plot_h = height - margin_top - margin_bottom
    x_min, x_max = float(data[x_col].min()), float(data[x_col].max())
    y_min, y_max = float(data[y_col].min()), float(data[y_col].max())
    x_pad = (x_max - x_min) * 0.12 or 1
    y_pad = (y_max - y_min) * 0.12 or 1
    x_min -= x_pad
    x_max += x_pad
    y_min -= y_pad
    y_max += y_pad

    def sx(x):
        return margin_left + ((float(x) - x_min) / (x_max - x_min)) * plot_w

    def sy(y):
        return margin_top + plot_h - ((float(y) - y_min) / (y_max - y_min)) * plot_h

    parts = chart_shell(width, height, title, "Each point is one state/federal territory")
    parts.append(f'<rect x="{margin_left}" y="{margin_top}" width="{plot_w}" height="{plot_h}" rx="16" fill="#F8FAFC" stroke="#E5E7EB"/>')
    for tick in np.linspace(x_min, x_max, 5):
        x = sx(tick)
        parts.append(f'<line x1="{x:.1f}" y1="{margin_top}" x2="{x:.1f}" y2="{margin_top + plot_h}" stroke="{GRID}"/>')
        parts.append(svg_text(x, margin_top + plot_h + 24, fmt_num(tick, 1), 10, "middle", "500", MUTED))
    for tick in np.linspace(y_min, y_max, 5):
        y = sy(tick)
        parts.append(f'<line x1="{margin_left}" y1="{y:.1f}" x2="{margin_left + plot_w}" y2="{y:.1f}" stroke="{GRID}"/>')
        parts.append(svg_text(margin_left - 10, y + 4, fmt_num(tick, 1), 10, "end", "500", MUTED))
    if x_min < 0 < x_max:
        zx = sx(0)
        parts.append(f'<line x1="{zx:.1f}" y1="{margin_top}" x2="{zx:.1f}" y2="{margin_top + plot_h}" stroke="#CBD5E1" stroke-dasharray="4 4"/>')
    if y_min < 0 < y_max:
        zy = sy(0)
        parts.append(f'<line x1="{margin_left}" y1="{zy:.1f}" x2="{margin_left + plot_w}" y2="{zy:.1f}" stroke="#CBD5E1" stroke-dasharray="4 4"/>')

    for i, (_, row) in enumerate(data.iterrows()):
        color = PALETTE[i % len(PALETTE)]
        x = sx(row[x_col])
        y = sy(row[y_col])
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="{color}" opacity="0.9"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="12" fill="{color}" opacity="0.13"/>')
        parts.append(svg_text(x + 10, y - 8, row[label_col], 11, "start", "700", "#334155"))

    parts.append(svg_text(width / 2, height - 34, x_col.replace("_", " "), 13, "middle", "700", INK))
    parts.append(svg_text(34, height / 2, y_col.replace("_", " "), 13, "middle", "700", INK))
    parts.append(svg_text(width - 56, height - 36, "Source: cleaned DATATHON tables", 10, "end", "500", MUTED))
    write_svg(output_path, "\n".join(parts), width, height)


def heatmap_svg(corr: pd.DataFrame, title: str, output_path: Path, width: int = 1180, height: int = 860) -> None:
    labels = list(corr.columns)
    n = len(labels)
    margin_left = 380
    margin_top = 150
    cell = min((width - margin_left - 80) / n, (height - margin_top - 95) / n)

    def color(v):
        if pd.isna(v):
            return "#F3F4F6"
        # Blue for negative, red for positive, white near zero.
        v = max(-1, min(1, float(v)))
        if v >= 0:
            r = int(255 - (1 - v) * 35)
            g = int(255 - v * 130)
            b = int(255 - v * 130)
        else:
            r = int(255 + v * 150)
            g = int(255 + v * 80)
            b = 255
        return f"#{r:02X}{g:02X}{b:02X}"

    parts = chart_shell(width, height, title, "Spearman rank correlations across calculated indicators")
    parts.append(f'<rect x="{margin_left - 14}" y="{margin_top - 14}" width="{cell * n + 28:.1f}" height="{cell * n + 28:.1f}" rx="18" fill="#F8FAFC" stroke="#E5E7EB"/>')
    for i, row_label in enumerate(labels):
        y = margin_top + i * cell
        parts.append(f'<rect x="{margin_left - 42:.1f}" y="{y + cell * 0.22:.1f}" width="26" height="26" rx="13" fill="#EEF2FF" stroke="#DBEAFE"/>')
        parts.append(svg_text(margin_left - 29, y + cell * 0.62, str(i + 1), 11, "middle", "800", "#1D4ED8"))
        parts.append(svg_text(margin_left + i * cell + cell / 2, margin_top - 18, str(i + 1), 10, "middle", "800", MUTED))
        for j, col_label in enumerate(labels):
            x = margin_left + j * cell
            val = corr.loc[row_label, col_label]
            parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{cell - 3:.1f}" height="{cell - 3:.1f}" rx="8" fill="{color(val)}" stroke="#FFFFFF"/>')
            parts.append(svg_text(x + cell / 2, y + cell * 0.58, "" if pd.isna(val) else f"{val:.2f}", 9, "middle", "800", "#111827"))
    legend_x = 58
    legend_y = margin_top
    parts.append(svg_text(legend_x, legend_y, "Column Key", 13, "start", "800", INK))
    for idx, label in enumerate(labels):
        parts.append(svg_text(legend_x, legend_y + 24 + idx * 19, f"{idx + 1}. {label.replace('_', ' ')}", 10, "start", "600", MUTED))
    parts.append(svg_text(margin_left - 30, margin_top - 18, "Row", 10, "middle", "800", MUTED))
    parts.append(svg_text(width - 56, height - 36, "Blue = negative, red = positive", 10, "end", "500", MUTED))
    write_svg(output_path, "\n".join(parts), width, height)


def top_md(df: pd.DataFrame, cols: list[str], n: int = 5) -> str:
    sample = df[cols].head(n).copy()
    headers = list(sample.columns)
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for _, row in sample.iterrows():
        values = []
        for col in headers:
            value = row[col]
            if isinstance(value, (int, float, np.number)) and not pd.isna(value):
                values.append(fmt_num(float(value), 1))
            else:
                values.append("" if pd.isna(value) else str(value))
        lines.append("| " + " | ".join(values) + " |")
    return "\n".join(lines)


def load_data(input_dir: Path) -> dict[str, pd.DataFrame]:
    required = [
        "cleaned_data.csv",
        "district_opportunity.csv",
        "destination_rankings_2024_2025.csv",
        "google_trends_monthly.csv",
    ]
    missing = [name for name in required if not (input_dir / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing required files in {input_dir}: {missing}")
    return {
        "cleaned": pd.read_csv(input_dir / "cleaned_data.csv"),
        "district": pd.read_csv(input_dir / "district_opportunity.csv"),
        "destinations": pd.read_csv(input_dir / "destination_rankings_2024_2025.csv"),
        "trends": pd.read_csv(input_dir / "google_trends_monthly.csv"),
    }


def build_eda(input_dir: Path, output_dir: Path) -> None:
    tables_dir, charts_dir = ensure_dirs(output_dir)
    data = load_data(input_dir)
    cleaned = data["cleaned"]
    district = data["district"]
    destinations = data["destinations"]
    trends = data["trends"]

    latest_year = int(cleaned["year"].max())
    earliest_year = int(cleaned["year"].min())
    latest = cleaned[cleaned["year"] == latest_year].copy()
    baseline = cleaned[cleaned["year"] == earliest_year][[
        "state",
        "domestic_visitors_000",
        "tourism_receipts_rm_million",
        "google_search_interest",
    ]].rename(columns={
        "domestic_visitors_000": "visitors_2019_000",
        "tourism_receipts_rm_million": "receipts_2019_rm_million",
        "google_search_interest": "search_2019",
    })
    latest = latest.merge(baseline, on="state", how="left")
    latest["visitor_recovery_vs_2019_pct"] = latest["domestic_visitors_000"] / latest["visitors_2019_000"] * 100
    latest["receipt_recovery_vs_2019_pct"] = latest["tourism_receipts_rm_million"] / latest["receipts_2019_rm_million"] * 100
    latest["visitor_cagr_2019_2025_pct"] = [
        cagr(s, e, latest_year - earliest_year) * 100
        for s, e in zip(latest["visitors_2019_000"], latest["domestic_visitors_000"])
    ]
    latest["receipt_cagr_2019_2025_pct"] = [
        cagr(s, e, latest_year - earliest_year) * 100
        for s, e in zip(latest["receipts_2019_rm_million"], latest["tourism_receipts_rm_million"])
    ]

    rankings = {
        "top_2025_visitors.csv": latest.sort_values("domestic_visitors_000", ascending=False),
        "top_2025_receipts.csv": latest.sort_values("tourism_receipts_rm_million", ascending=False),
        "top_2025_tourism_growth.csv": latest.sort_values("tourism_growth_pct", ascending=False),
        "top_2025_spending_per_visitor.csv": latest.sort_values("spending_per_visitor_rm", ascending=False),
        "top_2025_tourism_intensity.csv": latest.sort_values("tourism_intensity", ascending=False),
        "top_2025_search_interest.csv": latest.sort_values("google_search_interest", ascending=False),
        "top_2025_search_growth.csv": latest.sort_values("search_interest_growth_pct", ascending=False),
    }
    for filename, df in rankings.items():
        df.to_csv(tables_dir / filename, index=False)

    state_growth_rows = []
    for state, group in cleaned.sort_values("year").groupby("state"):
        first = group[group["year"] == earliest_year].iloc[0]
        last = group[group["year"] == latest_year].iloc[0]
        state_growth_rows.append({
            "state": state,
            "visitor_change_2019_2025_pct": (last["domestic_visitors_000"] / first["domestic_visitors_000"] - 1) * 100,
            "receipt_change_2019_2025_pct": (last["tourism_receipts_rm_million"] / first["tourism_receipts_rm_million"] - 1) * 100,
            "visitor_cagr_2019_2025_pct": cagr(first["domestic_visitors_000"], last["domestic_visitors_000"], latest_year - earliest_year) * 100,
            "receipt_cagr_2019_2025_pct": cagr(first["tourism_receipts_rm_million"], last["tourism_receipts_rm_million"], latest_year - earliest_year) * 100,
            "search_change_2019_2025_pct": (last["google_search_interest"] / first["google_search_interest"] - 1) * 100 if first["google_search_interest"] else np.nan,
        })
    state_growth = pd.DataFrame(state_growth_rows).sort_values("visitor_change_2019_2025_pct", ascending=False)
    state_growth.to_csv(tables_dir / "state_growth_2019_2025.csv", index=False)

    numeric_cols = [
        "tourism_growth_pct",
        "tourism_value_growth_pct",
        "spending_per_visitor_rm",
        "trips_per_visitor",
        "tourism_intensity",
        "income_median",
        "poverty",
        "google_search_interest",
        "search_interest_growth_pct",
    ]
    corr = cleaned[numeric_cols].corr(method="spearman").round(3)
    corr.to_csv(tables_dir / "spearman_correlations.csv")

    pattern_summary = (
        cleaned.groupby(["year", "opportunity_pattern", "pressure_pattern"], as_index=False)
        .agg(
            states=("state", "nunique"),
            avg_tourism_growth_pct=("tourism_growth_pct", "mean"),
            avg_search_growth_pct=("search_interest_growth_pct", "mean"),
            avg_intensity=("tourism_intensity", "mean"),
            avg_spending_per_visitor_rm=("spending_per_visitor_rm", "mean"),
        )
        .sort_values(["year", "states"], ascending=[True, False])
    )
    pattern_summary.to_csv(tables_dir / "pattern_summary.csv", index=False)

    latest_district = district.sort_values(["state", "district", "year"]).groupby(["state", "district"], as_index=False).tail(1)
    latest_district.sort_values("google_trend_annual_avg", ascending=False).to_csv(tables_dir / "top_district_search_latest.csv", index=False)
    latest_district.sort_values("google_trend_yoy_change", ascending=False).to_csv(tables_dir / "rising_district_search_latest.csv", index=False)
    latest_district.sort_values(["poverty", "income_median"], ascending=[False, True]).to_csv(tables_dir / "district_higher_need_latest.csv", index=False)

    destination_latest = destinations[destinations["year"] == latest_year].copy()
    destination_counts = (
        destination_latest.groupby("destination", as_index=False)
        .agg(appearances=("state", "count"), states=("state", lambda x: "; ".join(sorted(set(x)))))
        .sort_values(["appearances", "destination"], ascending=[False, True])
    )
    destination_counts.to_csv(tables_dir / "destination_appearance_2025.csv", index=False)

    data_quality = pd.DataFrame({
        "dataset": ["cleaned_data", "district_opportunity", "destination_rankings", "google_trends_monthly"],
        "rows": [len(cleaned), len(district), len(destinations), len(trends)],
        "columns": [cleaned.shape[1], district.shape[1], destinations.shape[1], trends.shape[1]],
        "duplicate_key_rows": [
            int(cleaned.duplicated(["state", "year"]).sum()),
            int(district.duplicated(["state", "district", "year"]).sum()),
            int(destinations.duplicated(["state", "year", "visitor_type", "rank"]).sum()),
            int(trends.duplicated(["state", "month", "area", "geo_level", "source_file", "duplicate_column_flag"]).sum()),
        ],
    })
    data_quality.to_csv(tables_dir / "data_quality_summary.csv", index=False)

    indicator_status = pd.DataFrame([
        {"indicator": "Tourism Growth", "field": "tourism_growth_pct", "status": "available", "method": "Annual domestic visitor growth from tourism Table 1."},
        {"indicator": "Spending per Visitor", "field": "spending_per_visitor_rm", "status": "available", "method": "Average receipts per domestic visitor."},
        {"indicator": "Trips per Visitor", "field": "trips_per_visitor", "status": "available", "method": "Tourism trips divided by domestic visitors."},
        {"indicator": "Tourism Intensity", "field": "tourism_intensity", "status": "available", "method": "Domestic visitors divided by resident population."},
        {"indicator": "Tourism Value Growth", "field": "tourism_value_growth_pct", "status": "available", "method": "Annual tourism receipt growth."},
        {"indicator": "Local Prosperity Context", "field": "local_prosperity_context", "status": "available with gaps", "method": "Income/poverty context where HIES data exists."},
        {"indicator": "Google Search Interest", "field": "google_search_interest", "status": "available", "method": "Annual average Google Trends index."},
        {"indicator": "Search Interest Growth", "field": "search_interest_growth_pct", "status": "available", "method": "Year-on-year percentage change in search interest."},
        {"indicator": "Digital Interest Trend", "field": "digital_interest_trend", "status": "available", "method": "Categorical label from search growth."},
        {"indicator": "Emerging Viral Destination", "field": "emerging_viral_destination", "status": "available as search proxy", "method": "Uses Google Search Interest only."},
        {"indicator": "Opportunity Pattern", "field": "opportunity_pattern", "status": "available", "method": "Rule-based flag using growth, search, intensity and poverty."},
        {"indicator": "Pressure Pattern", "field": "pressure_pattern", "status": "available", "method": "Rule-based flag using tourism intensity and growth momentum."},
    ])
    indicator_status.to_csv(tables_dir / "indicator_status.csv", index=False)

    # Graphics.
    bar_chart(rankings["top_2025_visitors.csv"], "state", "domestic_visitors_000", "Top States by Domestic Visitors, 2025 ('000)", charts_dir / "top_states_by_visitors.svg", "k")
    bar_chart(rankings["top_2025_receipts.csv"], "state", "tourism_receipts_rm_million", "Top States by Tourism Receipts, 2025 (RM million)", charts_dir / "top_states_by_receipts.svg")
    bar_chart(rankings["top_2025_tourism_growth.csv"], "state", "tourism_growth_pct", "Highest Tourism Growth, 2025", charts_dir / "tourism_growth_2025.svg", "%")
    bar_chart(rankings["top_2025_spending_per_visitor.csv"], "state", "spending_per_visitor_rm", "Highest Spending per Visitor, 2025 (RM)", charts_dir / "spending_per_visitor_2025.svg")
    bar_chart(rankings["top_2025_tourism_intensity.csv"], "state", "tourism_intensity", "Highest Tourism Intensity, 2025", charts_dir / "tourism_intensity_2025.svg")
    bar_chart(rankings["top_2025_search_growth.csv"], "state", "search_interest_growth_pct", "Google Search Interest Growth, 2025", charts_dir / "search_interest_growth_2025.svg", "%")
    bar_chart(state_growth, "state", "visitor_change_2019_2025_pct", "Visitor Change from 2019 to 2025", charts_dir / "visitor_recovery_2019_2025.svg", "%")

    top_groups = rankings["top_2025_visitors.csv"].head(5)["state"].tolist()
    line_chart(cleaned, "year", "domestic_visitors_000", "state", "Domestic Visitor Trend for Top 5 States", charts_dir / "visitor_trend_top5.svg", top_groups)
    line_chart(cleaned, "year", "tourism_receipts_rm_million", "state", "Tourism Receipts Trend for Top 5 Visitor States", charts_dir / "receipt_trend_top5.svg", top_groups)
    scatter_chart(latest, "search_interest_growth_pct", "tourism_growth_pct", "state", "Tourism Growth vs Search Interest Growth, 2025", charts_dir / "growth_vs_search_scatter.svg")
    scatter_chart(latest, "tourism_intensity", "tourism_growth_pct", "state", "Tourism Growth vs Tourism Intensity, 2025", charts_dir / "growth_vs_intensity_scatter.svg")
    heatmap_svg(corr, "Spearman Correlation Heatmap", charts_dir / "spearman_correlation_heatmap.svg")

    summary = {
        "latest_year": latest_year,
        "state_count": int(cleaned["state"].nunique()),
        "district_count": int(district[["state", "district"]].drop_duplicates().shape[0]),
        "chart_count": len(list(charts_dir.glob("*.svg"))),
        "top_2025_by_visitors": rankings["top_2025_visitors.csv"].head(5)[["state", "domestic_visitors_000"]].to_dict("records"),
        "top_2025_by_receipts": rankings["top_2025_receipts.csv"].head(5)[["state", "tourism_receipts_rm_million"]].to_dict("records"),
        "top_2025_by_growth": rankings["top_2025_tourism_growth.csv"].head(5)[["state", "tourism_growth_pct"]].to_dict("records"),
        "main_limitations": [
            "District-level actual tourism visitors are not available in the provided files.",
            "District HIES prosperity fields are only populated for HIES years such as 2022 and 2024.",
            "Map data has district names but no geometry or coordinates.",
            "Emerging Viral Destination is a Google Trends proxy, not a full social-media virality measure.",
        ],
    }
    (output_dir / "eda_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

    report = f"""# Malaysia Tourism Datathon EDA

Generated from: `{input_dir.as_posix()}`

## Data Scope

- State-year tourism dashboard table: {len(cleaned):,} rows, {cleaned['state'].nunique()} states/federal territories, {cleaned['year'].min()}-{cleaned['year'].max()}.
- District opportunity table: {len(district):,} rows, {district[['state', 'district']].drop_duplicates().shape[0]} state-district pairs, {district['year'].min()}-{district['year'].max()}.
- Destination rankings: {len(destinations):,} rows for 2024-2025.
- Google Trends monthly table: {len(trends):,} rows, {trends['year'].min()}-{trends['year'].max()}.

## Data Quality

- Duplicate `state + year` rows: {int(cleaned.duplicated(['state', 'year']).sum())}.
- Duplicate `state + district + year` rows: {int(district.duplicated(['state', 'district', 'year']).sum())}.
- Duplicate destination ranking keys: {int(destinations.duplicated(['state', 'year', 'visitor_type', 'rank']).sum())}.

## Key Findings

Top states by domestic visitors:

{top_md(rankings['top_2025_visitors.csv'], ['state', 'domestic_visitors_000', 'tourism_growth_pct'], 8)}

Top states by tourism receipts:

{top_md(rankings['top_2025_receipts.csv'], ['state', 'tourism_receipts_rm_million', 'tourism_value_growth_pct'], 8)}

Highest tourism growth:

{top_md(rankings['top_2025_tourism_growth.csv'], ['state', 'tourism_growth_pct', 'domestic_visitors_000'], 8)}

Highest spending per visitor:

{top_md(rankings['top_2025_spending_per_visitor.csv'], ['state', 'spending_per_visitor_rm', 'tourism_receipts_rm_million'], 8)}

Highest tourism intensity:

{top_md(rankings['top_2025_tourism_intensity.csv'], ['state', 'tourism_intensity', 'domestic_visitors_000', 'population_000'], 8)}

Strongest Google Search Interest growth:

{top_md(rankings['top_2025_search_growth.csv'], ['state', 'search_interest_growth_pct', 'google_search_interest', 'digital_interest_trend'], 8)}

## Graphics

Charts are saved in `charts/` as SVG:

- `top_states_by_visitors.svg`
- `top_states_by_receipts.svg`
- `tourism_growth_2025.svg`
- `spending_per_visitor_2025.svg`
- `tourism_intensity_2025.svg`
- `search_interest_growth_2025.svg`
- `visitor_recovery_2019_2025.svg`
- `visitor_trend_top5.svg`
- `receipt_trend_top5.svg`
- `growth_vs_search_scatter.svg`
- `growth_vs_intensity_scatter.svg`
- `spearman_correlation_heatmap.svg`

## Dashboard Story Recommendation

Use the dashboard flow:

1. National overview: total visitors, receipts, growth, and top states in 2025.
2. State comparison: visitors, receipts, spending per visitor, trips per visitor, and tourism intensity.
3. Digital interest: Google Search Interest and Search Interest Growth by state/district.
4. Opportunity explorer: `opportunity_pattern`, `pressure_pattern`, prosperity context, and district Google Trends.
5. Destination drill-down: Table 9 destinations for selected state.

Important: district-level actual visitor counts are not available in the source data. District views should be framed as opportunity context.
"""
    (output_dir / "EDA_report.md").write_text(report, encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate EDA report, tables, and SVG charts for the Malaysia tourism datathon.")
    parser.add_argument("--input", type=Path, default=Path("outputs/datathon_cleaned_all_files"), help="Folder containing cleaned CSV files.")
    parser.add_argument("--output", type=Path, default=Path("outputs/datathon_eda_github"), help="Folder where EDA outputs will be written.")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    build_eda(args.input, args.output)
    print(f"EDA report, tables, and charts written to {args.output}")
