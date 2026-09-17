# Malaysia Tourism Datathon EDA

Generated from: `outputs/datathon_cleaned_all_files`

## Data Scope

- State-year tourism dashboard table: 112 rows, 16 states/federal territories, 2019-2025.
- District opportunity table: 960 rows, 163 state-district pairs, 2020-2025.
- Destination rankings: 320 rows for 2024-2025.
- Google Trends monthly table: 14,810 rows, 2018-2025.

## Data Quality

- Duplicate `state + year` rows: 0.
- Duplicate `state + district + year` rows: 0.
- Duplicate destination ranking keys: 0.

## Key Findings

Top states by domestic visitors:

| state | domestic_visitors_000 | tourism_growth_pct |
| --- | --- | --- |
| Selangor | 36,376.4 | 5.6 |
| W.P. Kuala Lumpur | 35,060.0 | 29.9 |
| Perak | 23,642.1 | 8.6 |
| Pahang | 23,161.2 | 14.8 |
| Sarawak | 22,721.5 | 15.8 |
| Sabah | 22,361.2 | 8.6 |
| Melaka | 20,832.2 | 8.9 |
| Negeri Sembilan | 19,356.5 | 8.8 |

Top states by tourism receipts:

| state | tourism_receipts_rm_million | tourism_value_growth_pct |
| --- | --- | --- |
| W.P. Kuala Lumpur | 16,906.0 | 20.1 |
| Selangor | 15,761.7 | 10.8 |
| Pahang | 9,846.8 | 13.1 |
| Sabah | 9,753.3 | 13.0 |
| Sarawak | 9,138.4 | 14.9 |
| Melaka | 8,732.4 | 10.1 |
| Johor | 8,722.9 | 11.6 |
| Pulau Pinang | 8,490.4 | 14.4 |

Highest tourism growth:

| state | tourism_growth_pct | domestic_visitors_000 |
| --- | --- | --- |
| W.P. Labuan | 34.4 | 604.0 |
| W.P. Kuala Lumpur | 29.9 | 35,060.0 |
| W.P. Putrajaya | 23.1 | 3,146.0 |
| Perlis | 16.4 | 3,755.7 |
| Sarawak | 15.8 | 22,721.5 |
| Pahang | 14.8 | 23,161.2 |
| Kelantan | 14.7 | 12,062.0 |
| Melaka | 8.9 | 20,832.2 |

Highest spending per visitor:

| state | spending_per_visitor_rm | tourism_receipts_rm_million |
| --- | --- | --- |
| W.P. Labuan | 628.0 | 379.0 |
| W.P. Kuala Lumpur | 482.0 | 16,906.0 |
| Johor | 479.4 | 8,722.9 |
| Pulau Pinang | 479.2 | 8,490.4 |
| Sabah | 436.2 | 9,753.3 |
| Kelantan | 434.3 | 5,239.0 |
| Selangor | 433.3 | 15,761.7 |
| Pahang | 425.1 | 9,846.8 |

Highest tourism intensity:

| state | tourism_intensity | domestic_visitors_000 | population_000 |
| --- | --- | --- | --- |
| W.P. Putrajaya | 26.1 | 3,146.0 | 120.7 |
| Melaka | 19.8 | 20,832.2 | 1,052.0 |
| W.P. Kuala Lumpur | 16.9 | 35,060.0 | 2,075.2 |
| Negeri Sembilan | 15.6 | 19,356.5 | 1,243.9 |
| Pahang | 13.8 | 23,161.2 | 1,676.8 |
| Perlis | 12.6 | 3,755.7 | 297.0 |
| Terengganu | 12.4 | 15,462.3 | 1,245.8 |
| Pulau Pinang | 9.8 | 17,718.0 | 1,804.3 |

Strongest Google Search Interest growth:

| state | search_interest_growth_pct | google_search_interest | digital_interest_trend |
| --- | --- | --- | --- |
| W.P. Labuan | 8.3 | 80.2 | increasing |
| Pahang | 4.7 | 52.2 | stable |
| Negeri Sembilan | 3.4 | 58.1 | stable |
| W.P. Kuala Lumpur | 3.1 | 82.7 | stable |
| Sabah | 2.6 | 67.5 | stable |
| Kedah | 1.4 | 48.4 | stable |
| Johor | 0.6 | 68.6 | stable |
| Sarawak | -2.1 | 47.2 | stable |

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
