# Tourism Intelligence ML Pipeline

This directory contains the forecasting and tourism-intelligence outputs developed for the tourism datathon.

## Objective

The pipeline forecasts next-month Google Trends interest for 167 Malaysian geographic series:

- 16 state series
- 151 district or area series

Google Trends is used as a digital-interest proxy. It does not represent visitor arrivals or absolute tourism demand.

## Forecasting Method

The final method is a segmented hybrid:

- State series: three-month mean with CatBoost residual correction
- District/area series: three-month mean
- Constant or insufficient-variation series: three-month mean

Tourism context features were tested but excluded because they worsened validation MAE by 3.93%.

## Validation

Rolling-origin validation used 2022, 2023 and 2024.

- Hybrid won 2 of 3 validation folds
- Mean validation MAE improvement: 1.98%
- Final untouched 2025 test improvement: 1.82%
- Hybrid test MAE: 1.821
- Three-month baseline test MAE: 1.854

The 2025 test set was not used for model tuning.

## State Intelligence

State outputs contain:

- Next-month digital-demand forecast
- Opportunity score
- Tourism-pressure score
- Transparent component values
- Data-year and limitation fields

These are decision-support indicators, not causal predictions.

## District Intelligence

District outputs contain:

- Validated mapping for 151 forecast areas
- Digital emerging-signal score
- Development-support context score
- Signal category
- Data-confidence label
- Leading signal components

District digital scores are based on within-series changes because Google Trends indices are normalized separately for each series.

## Main Outputs

| File | Purpose |
|---|---|
| `outputs/demand_forecast_latest.csv` | Latest forecasts for all 167 series |
| `outputs/series_registry.csv` | Series coverage and model registry |
| `outputs/state_tourism_intelligence_latest.csv` | State opportunity and pressure indicators |
| `outputs/district_series_crosswalk.csv` | Forecast-area to DOSM district mapping |
| `outputs/district_emerging_signals_latest.csv` | District digital and development-context signals |
| `artifacts/model_metadata.json` | Forecast model methodology and evaluation |
| `artifacts/scoring_metadata.json` | State scoring methodology |
| `artifacts/district_signal_metadata.json` | District scoring methodology |
| `artifacts/export_manifest.json` | File sizes and SHA-256 checksums |

## Important Limitations

- Google Trends values are normalized indices, not visitor counts.
- Indices should not be interpreted as absolute market size.
- District socioeconomic indicators use their latest available year.
- Low-variation series receive medium or low confidence.
- Categories are monitoring signals, not investment recommendations.