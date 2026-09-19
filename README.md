# Databladez

### Gliding Across Malaysia

**Sustainable Tourism Intelligence Dashboard for DOSM Datathon 2026**

Databladez is an interactive tourism intelligence dashboard designed to support the exploration of Malaysia's domestic tourism performance, digital-interest trends, state-level tourism signals, and emerging district-level opportunities.

🔗 **Live Dashboard:** https://databladez-tourism.vercel.app/

---

## Overview

Databladez combines Malaysian tourism indicators with digital-interest signals and precomputed machine-learning outputs to provide a clear view of tourism activity across Malaysia.

The dashboard is designed around four main questions:

- How is domestic tourism performing nationally?
- How do Malaysian states compare across tourism indicators?
- What do the latest opportunity, pressure, and digital-interest signals suggest?
- Which districts show emerging tourism-related digital momentum that may warrant further review?

The system is intended as a **decision-support and monitoring tool**, not as an automated investment or destination-ranking system.

---

## Dashboard Pages

### 1. Overview

Provides a national-level summary of Malaysian domestic tourism.

Key elements include:

- Domestic visitor totals
- Tourism receipts
- Top state by domestic visitors
- National tourism trend from 2019–2025
- Comparison of leading states by domestic visitor volume

---

### 2. Explore

Allows users to select a Malaysian state and examine its tourism profile.

Indicators include:

- Domestic visitors
- Tourism receipts
- Spending per visitor
- Tourism growth
- Tourism intensity
- Google Search interest
- Opportunity pattern
- Pressure pattern
- State comparison visualization

---

### 3. AI Insights

Presents the analytical and machine-learning outputs developed for the project.

#### State Intelligence

Includes:

- Tourism opportunity score
- Tourism pressure score
- Opportunity versus pressure comparison
- Next-month search-interest forecast
- Forecast direction and change
- Forecast method
- Leading opportunity driver
- Leading pressure driver

#### District Emerging Signals

Includes:

- Searchable district table
- State filtering
- Signal-category filtering
- Confidence filtering
- Sorting by digital signal and development context
- Pagination
- District-level detail panel
- Digital emerging-signal score
- Development Support Context
- Data-confidence classification
- Signal-quality information

---

### 4. Recommendations

Translates state and district signals into structured tourism-planning guidance.

The page provides:

- State-level decision pattern
- Opportunity and pressure indicators
- Suggested monitoring or development direction
- Leading evidence
- Relevant district signals for the selected state
- Confidence-aware district recommendations

Recommendations should be interpreted together with local feasibility, infrastructure, stakeholder knowledge, and other supporting evidence.

---

## Machine Learning and Analytics

The machine-learning pipeline was developed separately from the frontend and exported as precomputed outputs.

Primary ML output files include:

```text
ml/outputs/demand_forecast_latest.json
ml/outputs/state_tourism_intelligence_latest.json
ml/outputs/district_emerging_signals_latest.json
```

The dashboard does not run CatBoost inference in the browser.

The frontend presents the supplied outputs without recalculating or altering the ML scores.

### Forecasting

State-level search-interest forecasts use a segmented hybrid forecasting approach that may include:

```text
Three-month mean + CatBoost residual correction
```

The forecast represents the **next-month Google Trends / search-interest index**.

It does **not** represent:

- Predicted tourist arrivals
- Tourism revenue forecasts
- Hotel occupancy
- Probability of tourism growth
- Guaranteed tourism demand

---

## Important Interpretation Notes

### Opportunity Score

The state Opportunity Score is a **relative composite indicator** used to compare tourism-related signals across Malaysian states.

A higher score should not be interpreted as:

- Investment return
- Revenue potential
- Probability of tourism success
- Destination quality
- Automatic funding priority

### Pressure Score

The Pressure Score represents **relative tourism monitoring pressure**.

It is not a direct measurement of:

- Environmental damage
- Carbon emissions
- Ecological degradation
- Tourism carrying capacity

### Google Trends

Google Trends is used as a **digital-interest proxy**.

Google Trends series are independently normalized, meaning raw index values should not be interpreted as absolute search volume across different districts.

District emerging-signal scores describe **relative momentum within the available digital series**.

They do not represent a probability of tourism growth.

### Development Support Context

Development Support Context is a separate socioeconomic indicator.

A higher development-context score does **not** automatically imply:

- Higher tourism demand
- Greater tourism opportunity
- Higher investment potential

It should be considered separately from digital tourism-interest signals.

### Missing Values

Where a digital score cannot be calculated reliably, the dashboard displays:

```text
Unavailable
```

Missing values are not converted to zero.

---

## Data Coverage

The analytical outputs cover:

| Output | Coverage |
|---|---:|
| Malaysian state series | 16 |
| District / area series | 151 |
| Total forecast series | 167 |
| Districts with digital scores | 116 |
| Constant / unscored districts | 35 |
| Districts with usable development context | 148 |

District confidence levels are displayed as:

```text
High
Medium
Low
```

Confidence labels are provided for district-level signals only.

---

## Data Sources

The project uses authentic Malaysian tourism and supporting data prepared for DOSM Datathon 2026.

Key sources include:

- **Department of Statistics Malaysia (DOSM)**
  - Domestic Tourism Survey
  - Domestic Tourism Survey (States) 2025
- **Google Trends**
  - Used as a digital-interest proxy
- Supporting Malaysian socioeconomic datasets included in the project's cleaned analytical datasets

Processed and cleaned datasets used by the dashboard are stored within the repository.

Exact dataset provenance, transformations, assumptions, and references should be read together with the project report and reproducibility materials.

---

## Technology Stack

### Frontend

- Next.js 16.3.5
- React
- TypeScript
- Tailwind CSS
- Recharts
- PapaParse

### Analytics and Machine Learning

- Python
- Jupyter Notebook
- CatBoost
- Pandas
- NumPy
- Statistical and exploratory data analysis

### Deployment

- Vercel
- GitHub

---

## Project Structure

```text
Databladez_Tourism/
│
├── analysis/
│   ├── notebooks/
│   │   ├── 01_data_audit.ipynb
│   │   └── 04_district_intelligence.ipynb
│   ├── scripts/
│   │   └── generate_eda.py
│   └── outputs/
│       ├── datathon_cleaned_all_files/
│       └── datathon_eda_github/
│
├── app/
│   ├── ai-insights/
│   ├── explore/
│   ├── recommendations/
│   ├── icon.svg
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
│   └── summary_metrics.json
│
├── ml/
│   ├── artifacts/
│   └── outputs/
│
├── public/
│
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── README.txt
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Run Locally

### Requirements

Install:

- Node.js
- npm

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

---

## Production Build

Run:

```bash
npm run build
```

The current application uses statically prerendered routes:

```text
/
├── /explore
├── /ai-insights
└── /recommendations
```

---

## Public Deployment

The deployed dashboard can be accessed without login or local installation:

**https://databladez-tourism.vercel.app/**

---

## Dashboard Design

Databladez uses a consistent visual identity based on:

- Deep navy for primary navigation and analytical context
- Amber and orange for highlights and selected signals
- Light neutral backgrounds for analytical readability
- Responsive layouts for desktop and mobile use

The Databladez rollerblade identity represents the project tagline:

> **Gliding Across Malaysia**

---

## Limitations

The dashboard should be interpreted with the following limitations in mind:

- Google Trends represents digital search interest rather than confirmed tourist demand.
- Google Trends indices are independently normalized.
- Forecasts represent search-interest indices rather than tourist arrivals.
- Tourism Opportunity and Pressure Scores are relative composite indicators.
- Development Support Context should not be interpreted as tourism demand.
- Some district digital series contain insufficient variation for reliable scoring.
- Socioeconomic indicators may come from different reference years depending on data availability.
- The system does not include real-user behaviour, reviews, bookings, or personalized user profiles.
- Local tourism planning decisions should incorporate additional qualitative and operational evidence.

---

## DOSM Datathon 2026

Databladez was developed for **DOSM Datathon 2026** as a Sustainable Tourism Intelligence solution.

The project includes:

- Interactive web dashboard
- Data cleaning and exploratory analysis
- Tourism intelligence indicators
- Search-interest forecasting
- State-level opportunity and pressure analysis
- District emerging-signal analysis
- Reproducible analytical outputs
- Supporting documentation

---

## Team

**Databladez**

*Gliding Across Malaysia*

DOSM Datathon 2026