DATABLADEZ – SUSTAINABLE TOURISM INTELLIGENCE DASHBOARD
DOSM Datathon 2026
Team: Databladez

============================================================
1. DASHBOARD ACCESS
============================================================

Live Dashboard:
https://databladez-tourism.vercel.app/

The dashboard is publicly deployed through Vercel and can be accessed
through a standard web browser. No login or software installation is
required to view the live dashboard.

Recommended browser:
Google Chrome, Microsoft Edge, Safari, or another modern browser.

============================================================
2. SOFTWARE AND TECHNOLOGY
============================================================

Frontend Framework:
Next.js 16.3.5

Language:
TypeScript

Styling:
Tailwind CSS

Visualisation:
Recharts

CSV handling:
PapaParse

Deployment:
Vercel

The application uses precomputed analytical and machine-learning outputs.
No Python environment or live machine-learning inference is required to
use the deployed dashboard.

============================================================
3. DASHBOARD NAVIGATION
============================================================

The dashboard contains five main pages:

1. Overview
   - National tourism indicators
   - Tourism trend charts
   - State visitor comparisons
   - Opportunity, Pressure, and Digital Signal interpretation guide
   - Tourism intelligence snapshot

2. Explore
   - Select a Malaysian state or federal territory
   - Examine visitor volume, tourism receipts, spending per visitor,
     tourism growth, tourism intensity, and search interest
   - Compare visitor volume and tourism value across states

3. AI Insights
   - State Opportunity and Pressure Scores
   - Forecast momentum and leading analytical drivers
   - Model performance information
   - District emerging-signal explorer
   - Search, filter, sort, paginate, and inspect district records
   - Preview and export filtered district records as CSV

4. Recommendations
   - State-level decision-support guidance
   - Supporting Opportunity and Pressure evidence
   - Expandable "Why this recommendation?" section
   - District signals for further investigation
   - Printable / Save-as-PDF state brief

5. Data Sources & Methodology
   - Data sources
   - Analytical pipeline
   - Forecasting approach
   - Model validation results
   - Score definitions
   - Key limitations and interpretation guidance

The vertical navigation bar can be collapsed or expanded.
On smaller screens, navigation is available through the mobile menu.

============================================================
4. DATA COVERAGE
============================================================

Tourism statistics:
2019–2025

Digital forecast:
January 2026

State-level series:
16

District / area series:
151

Total forecast series:
167

District records with valid Digital Emerging Signal Scores:
116

District records without sufficient digital variation are shown as
Unavailable rather than assigned a score of zero.

============================================================
5. LOCAL DEVELOPMENT
============================================================

Local installation is NOT required for judging because the dashboard is
publicly deployed.

For development or reproducibility:

1. Install Node.js and npm.
2. Open Terminal in the project folder.
3. Run:

   npm install

4. Start the development server:

   npm run dev

5. Open:

   http://localhost:3000

To test the production build:

   npm run build
   npm start

============================================================
6. MAIN DATA OUTPUTS
============================================================

The frontend primarily uses the following precomputed analytical outputs:

ml/outputs/demand_forecast_latest.json
ml/outputs/state_tourism_intelligence_latest.json
ml/outputs/district_emerging_signals_latest.json

The dashboard does not retrain models or recalculate analytical scores in
the browser.

============================================================
7. DATA SOURCES
============================================================

Primary data sources include:

- Department of Statistics Malaysia (DOSM)
- OpenDOSM
- Google Trends

Google Trends is used as a digital-interest proxy and does not represent
confirmed tourist demand or tourist arrivals.

============================================================
8. IMPORTANT INTERPRETATION NOTES
============================================================

- Opportunity Scores are relative composite indicators across Malaysian
  states. They are not investment returns, destination-quality rankings,
  probabilities, or predicted revenue.

- Pressure Scores are relative monitoring-pressure indicators. They are
  not direct measurements of environmental damage, emissions, congestion,
  or visitor dissatisfaction.

- Digital Emerging Signal Scores represent relative digital-interest
  momentum among eligible districts. They are not probabilities of future
  tourism growth.

- Forecasts refer to next-month Google Trends search-interest indices,
  not forecasts of tourist arrivals, tourism receipts, hotel occupancy,
  or revenue.

- Raw Google Trends values are normalised independently for each series
  and should not be interpreted as directly comparable absolute search
  volumes between districts.

- Development Support Context is a separate socioeconomic indicator.
  A higher score does not automatically indicate stronger tourism demand
  or tourism potential.

- Dashboard recommendations are decision-support guidance only.
  Infrastructure, environmental, feasibility, community, and stakeholder
  evidence should be considered before action.

============================================================
9. DASHBOARD LIMITATIONS
============================================================

- Some district Google Trends series have insufficient variation for a
  reliable digital score.

- Google Trends reflects online search behaviour and may not represent all
  traveller groups.

- District digital signals should be treated as indicators for further
  investigation rather than confirmed tourism demand.

- The dashboard currently uses precomputed static analytical outputs rather
  than real-time data feeds.

============================================================
10. SUBMISSION FILES
============================================================

Dashboard.pdf
README.txt
Next.js dashboard source files
Supporting analytical outputs

Live Dashboard:
https://databladez-tourism.vercel.app/

============================================================
END OF README
============================================================