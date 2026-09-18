# Databladez — Sustainable Tourism Intelligence

An interactive tourism intelligence and decision-support dashboard developed for **DOSM Datathon 2026**.

**Theme:** Leveraging Machine Learning (ML) & Artificial Intelligence (AI) for sustainable tourism in Malaysia.

## Live Dashboard

**https://databladez-tourism.vercel.app/**

## Overview

Databladez transforms Malaysian tourism indicators, socioeconomic context, digital-interest signals and precomputed machine-learning outputs into an interactive dashboard for sustainable tourism analysis and decision support.

The project provides four main dashboard experiences:

- **Overview** — national tourism performance
- **Explore** — interactive state-level tourism analysis
- **AI Insights** — state tourism intelligence and district emerging signals
- **Recommendations** — evidence-based decision-support guidance

## Dashboard Pages

### 1. Overview

Route:

```text
/
```

The Overview page presents a national tourism snapshot including:

- Domestic visitor volume
- Tourism receipts
- Leading state by domestic visitor volume
- Malaysian regional coverage
- Domestic tourism trend
- State visitor comparison

---

### 2. Explore

Route:

```text
/explore
```

The Explore page allows users to select a Malaysian state or Federal Territory and review:

- Domestic visitors
- Tourism receipts
- Spending per visitor
- Tourism growth
- Tourism intensity
- Google Search Interest
- Opportunity pattern
- Pressure pattern

The **Visitor Volume vs Tourism Value** visualization compares states using domestic visitor volume and spending per visitor.

The selected state is highlighted for easier comparison.

---

### 3. AI Insights

Route:

```text
/ai-insights
```

The AI Insights page contains two analytical sections.

#### State Tourism Intelligence

Users can select a state and review:

- Opportunity Score
- Pressure Score
- Forecast Search Interest Index
- Forecast momentum
- Opportunity vs Tourism Pressure position
- Leading opportunity driver
- Leading pressure driver

#### District Emerging Signals

Users can:

- Search for districts
- Filter by state
- Filter by signal category
- Filter by confidence
- Sort district records
- Select districts for detailed information

District-level information may include:

- Digital Emerging-Signal Score
- Development Support Context
- Forecast Search Interest Index
- Short-term change
- Annual change
- Projected change
- Signal quality
- Data confidence
- Leading signal components

---

### 4. Recommendations

Route:

```text
/recommendations
```

The Recommendations page converts supplied tourism-intelligence classifications and analytical drivers into decision-support guidance.

It also surfaces relevant district signals that may warrant further monitoring or investigation.

The recommendations are intended to support analysis rather than replace detailed feasibility studies, stakeholder consultation, policy assessment or investment due diligence.

## Technology Stack

- **Next.js 16.3.5**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **Papa Parse**
- **Git / GitHub**
- **Vercel**

Exact package versions are recorded in:

```text
package.json
package-lock.json
```

## Data and ML Integration

The frontend consumes cleaned analytical data and precomputed machine-learning outputs stored in the repository.

### Analytical Data

Main analytical files are located under:

```text
datathon_final_package/
```

Supporting files include:

```text
datathon_final_package/chart_data/
datathon_final_package/cleaned_data.csv
datathon_final_package/data_dictionary.csv
datathon_final_package/definitions.txt
datathon_final_package/summary_metrics.json
```

### Machine-Learning Outputs

Main ML outputs are located under:

```text
ml/outputs/
```

Relevant outputs include:

```text
demand_forecast_latest.json
state_tourism_intelligence_latest.json
district_emerging_signals_latest.json
```

Supporting ML documentation is available in:

```text
ml/DEVELOPER_HANDOFF.md
ml/README.md
```

The browser does **not** execute the trained ML model directly.

Forecasts, scores and classifications are generated offline and integrated into the dashboard as precomputed outputs.

## Interpretation Notes

### Forecast Search Interest

The forecast shown in the dashboard represents a **next-month Google Trends / digital search-interest index**.

It is **not** a forecast of:

- Tourist arrivals
- Visitor counts
- Tourism receipts
- Hotel occupancy

### Opportunity Score

The Opportunity Score is a relative composite analytical indicator used to compare tourism-development signals across Malaysian states.

It should not be interpreted as:

- Investment return
- Probability of success
- Guaranteed tourism growth
- Predicted tourism revenue
- Automatic funding priority

### Pressure Score

The Pressure Score represents relative tourism monitoring pressure.

It does not directly measure:

- Environmental damage
- Carbon emissions
- Waste generation
- Ecological degradation
- Tourist dissatisfaction

### District Digital Signals

Google Trends district series are independently normalized.

District digital indicators therefore describe relative change and momentum within each district series rather than absolute search-market size between districts.

### Development Support Context

Development Support Context represents relative socioeconomic support needs.

A higher value does not automatically mean higher tourism demand, greater tourism opportunity or stronger investment potential.

### Missing District Scores

Some district records contain insufficient digital variation for a reliable Digital Emerging-Signal Score.

These records are displayed as:

```text
Unavailable
```

They are intentionally not converted to zero.

## Known Limitations

- District-level tourism visitor counts are not available in the current analytical dataset.
- District analysis therefore uses digital-interest and socioeconomic context rather than direct district visitor counts.
- No district geometry or latitude/longitude data were available in the analytical package for a reliable district-level map.
- Google Trends is used as a digital-interest proxy and does not represent confirmed tourist demand.
- Google Trends indices from separate district series cannot be interpreted as absolute search-volume comparisons.
- Some district records contain insufficient digital variation for a reliable Digital Emerging-Signal Score.
- Socioeconomic reference years may vary depending on available source data.
- ML outputs are precomputed rather than generated through live browser inference.
- Composite indicators should be interpreted together with their underlying drivers and local context.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Nadsyuhamus/Databladez_Tourism.git
```

Enter the project directory:

```bash
cd Databladez_Tourism
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Run:

```bash
npm run build
```

A successful production build should generate the dashboard routes:

```text
/
/explore
/ai-insights
/recommendations
```

## Deployment

The production dashboard is deployed through Vercel:

**https://databladez-tourism.vercel.app/**

For normal dashboard use, judges and users do not need:

- Login credentials
- Python
- CatBoost
- A local database
- Browser plugins
- A local ML environment

## Project Structure

```text
databladez-tourism/
├── app/
│   ├── ai-insights/
│   ├── explore/
│   ├── recommendations/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── DistrictIntelligenceDashboard.tsx
│   ├── ExploreDashboard.tsx
│   ├── KpiCard.tsx
│   ├── RecommendationsDashboard.tsx
│   ├── Sidebar.tsx
│   ├── StateComparisonChart.tsx
│   ├── StateIntelligenceDashboard.tsx
│   ├── StateValueScatter.tsx
│   └── TourismTrendChart.tsx
│
├── datathon_final_package/
│   ├── chart_data/
│   ├── cleaned_data.csv
│   ├── data_dictionary.csv
│   ├── definitions.txt
│   └── summary_metrics.json
│
├── ml/
│   ├── artifacts/
│   ├── outputs/
│   ├── scripts/
│   ├── DEVELOPER_HANDOFF.md
│   └── README.md
│
├── README.md
├── README.txt
├── package.json
└── package-lock.json
```

## DOSM Datathon 2026

This project was developed for the **DOSM Datathon 2026** challenge under the theme:

> Leveraging Machine Learning (ML) & Artificial Intelligence (AI) for sustainable tourism in Malaysia.

The dashboard demonstrates how tourism statistics, socioeconomic indicators, digital-interest signals and machine-learning outputs can be transformed into interpretable information for sustainable tourism decision support.

## Team

**Databladez**

Developed for DOSM Datathon 2026.