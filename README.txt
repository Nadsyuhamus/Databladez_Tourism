DATABLADEZ
SUSTAINABLE TOURISM INTELLIGENCE DASHBOARD
DOSM DATATHON 2026

============================================================
1. PROJECT INFORMATION
============================================================

Project Title:
Databladez | Sustainable Tourism Intelligence

Team:
Databladez

Competition:
DOSM Datathon 2026

Theme:
Leveraging Machine Learning (ML) & Artificial Intelligence (AI)
for sustainable tourism in Malaysia


============================================================
2. LIVE INTERACTIVE DASHBOARD
============================================================

Production URL:

https://databladez-tourism.vercel.app/

The dashboard is publicly accessible through a web browser.

No login, browser extension, plugin, Python environment, local
database, or machine-learning installation is required for
normal dashboard use.


============================================================
3. PROJECT PURPOSE
============================================================

Databladez is an interactive tourism intelligence and
decision-support dashboard for Malaysia.

The dashboard combines tourism indicators, socioeconomic
context, digital-interest indicators and precomputed
machine-learning outputs to support exploration of:

- National tourism performance
- State-level tourism patterns
- Tourism opportunity indicators
- Tourism pressure indicators
- Next-month digital-interest forecasts
- District emerging signals
- Development-support context
- Decision-support recommendations


============================================================
4. SOFTWARE AND TECHNOLOGY
============================================================

Frontend Framework:
Next.js 16.3.5

Programming Language:
TypeScript

Styling:
Tailwind CSS

Charting:
Recharts

CSV Parsing:
Papa Parse

Hosting:
Vercel

Version Control:
Git and GitHub

Source Repository:
https://github.com/Nadsyuhamus/Databladez_Tourism

Exact JavaScript dependency versions are recorded in:

package.json
package-lock.json


============================================================
5. HOW TO OPEN THE DASHBOARD
============================================================

STEP 1

Open a modern web browser such as:

- Google Chrome
- Microsoft Edge
- Safari
- Mozilla Firefox


STEP 2

Open:

https://databladez-tourism.vercel.app/


STEP 3

Use the left navigation menu on desktop.

On smaller screens, tap the menu icon at the top-left of the
screen.


============================================================
6. DASHBOARD NAVIGATION
============================================================

------------------------------------------------------------
A. OVERVIEW
------------------------------------------------------------

Route:

/

The Overview page provides a national tourism snapshot.

It includes:

- Latest domestic visitor volume
- Latest tourism receipts
- State with the highest domestic visitor volume
- Number of Malaysian regions covered
- Domestic tourism trend
- State visitor comparison


------------------------------------------------------------
B. EXPLORE
------------------------------------------------------------

Route:

/explore

Use the State selector to explore individual Malaysian states
and Federal Territories.

The page displays indicators including:

- Domestic visitors
- Tourism receipts
- Spending per visitor
- Tourism growth
- Tourism intensity
- Google Search Interest
- Opportunity pattern
- Pressure pattern

The Visitor Volume vs Tourism Value chart compares states
using:

X-axis:
Domestic visitor volume

Y-axis:
Spending per visitor

The selected state is highlighted in orange.


------------------------------------------------------------
C. AI INSIGHTS
------------------------------------------------------------

Route:

/ai-insights

This page contains State Tourism Intelligence and District
Emerging Signals.


STATE TOURISM INTELLIGENCE

Select a state to review:

- Opportunity Score
- Pressure Score
- Forecast Search Interest Index
- Forecast momentum
- Opportunity vs Tourism Pressure position
- Leading opportunity driver
- Leading pressure driver


DISTRICT EMERGING SIGNALS

The district intelligence section allows users to:

- Search for a district
- Filter by state
- Filter by signal category
- Filter by confidence
- Sort district records
- Select a district for additional details

District information may include:

- Digital Emerging-Signal Score
- Development Support Context
- Forecast Search Interest Index
- Short-term change
- Annual change
- Projected change
- Signal quality
- Data confidence
- Leading signal components


------------------------------------------------------------
D. RECOMMENDATIONS
------------------------------------------------------------

Route:

/recommendations

Select a state to review decision-support guidance based on
the supplied state tourism-intelligence classification and
analytical drivers.

The page also surfaces relevant district signals that may
warrant additional monitoring or investigation.

These recommendations are intended for decision support.

They do not replace detailed feasibility studies, stakeholder
consultation, local knowledge, policy assessment or investment
due diligence.


============================================================
7. DATA AND MACHINE-LEARNING INTEGRATION
============================================================

The frontend uses cleaned analytical datasets and precomputed
machine-learning outputs included with the project.

Main analytical files are located under:

datathon_final_package/

Main machine-learning outputs are located under:

ml/outputs/

Relevant supporting documentation includes:

datathon_final_package/data_dictionary.csv
datathon_final_package/definitions.txt
ml/DEVELOPER_HANDOFF.md
ml/README.md

The machine-learning model is not executed in the user's web
browser.

Forecasts, scores and classifications are generated offline
and supplied to the dashboard as precomputed outputs.


============================================================
8. IMPORTANT INTERPRETATION NOTES
============================================================

------------------------------------------------------------
A. FORECAST SEARCH INTEREST
------------------------------------------------------------

The forecast displayed by the dashboard represents a
next-month Google Trends / digital search-interest index.

It must NOT be interpreted as a forecast of:

- Tourist arrivals
- Visitor counts
- Tourism receipts
- Hotel occupancy


------------------------------------------------------------
B. OPPORTUNITY SCORE
------------------------------------------------------------

The Opportunity Score is a relative composite analytical
indicator used to compare tourism-development signals across
Malaysian states.

It must NOT be interpreted as:

- Expected investment return
- Probability of commercial success
- Guaranteed tourism growth
- Predicted tourism revenue
- Automatic funding priority


------------------------------------------------------------
C. PRESSURE SCORE
------------------------------------------------------------

The Pressure Score represents relative tourism monitoring
pressure.

It must NOT be interpreted directly as:

- Environmental damage
- Carbon emissions
- Waste generation
- Ecological degradation
- Tourist dissatisfaction


------------------------------------------------------------
D. DISTRICT DIGITAL SIGNALS
------------------------------------------------------------

Google Trends district series are independently normalized.

District digital indicators therefore describe relative
change and momentum within each district series.

They must NOT be interpreted as direct comparisons of
absolute search volume between districts.


------------------------------------------------------------
E. UNAVAILABLE SCORES
------------------------------------------------------------

Some district records contain insufficient digital variation
for a reliable Digital Emerging-Signal Score.

These records are displayed as:

Unavailable

They are intentionally not converted to zero.


------------------------------------------------------------
F. DEVELOPMENT SUPPORT CONTEXT
------------------------------------------------------------

Development Support Context represents relative socioeconomic
support needs.

A higher value should not automatically be interpreted as
higher tourism demand, greater tourism opportunity or stronger
investment potential.


============================================================
9. LIMITATIONS
============================================================

1. District-level tourism visitor counts are not available in
   the current analytical dataset.

2. District analysis therefore uses digital-interest and
   socioeconomic context rather than direct district visitor
   counts.

3. No district geometry or latitude/longitude data were
   available in the analytical package for a reliable
   district-level geographic map.

4. Google Trends is used as a proxy for digital interest and
   does not represent confirmed tourist demand.

5. Google Trends indices from separate district series are
   independently normalized and cannot be interpreted as
   absolute search-volume comparisons.

6. Some district records have insufficient digital variation
   and therefore do not receive a Digital Emerging-Signal
   Score.

7. Socioeconomic reference years may vary between indicators
   depending on available data.

8. Forecasts and intelligence scores are precomputed offline
   rather than generated through live browser inference.

9. Composite indicators should be interpreted together with
   their underlying drivers, local conditions and stakeholder
   evidence.


============================================================
10. RUNNING THE SOURCE CODE LOCALLY
============================================================

The live Vercel deployment is the recommended version for
dashboard evaluation.

To run the project locally:

1. Open a terminal.

2. Navigate to the project directory.

3. Install dependencies:

npm install

4. Start the development server:

npm run dev

5. Open:

http://localhost:3000


To test the production build:

npm run build


============================================================
11. EXTERNAL REQUIREMENTS
============================================================

For users accessing the live dashboard:

Required:
- Internet connection
- Modern web browser

Not required:
- Login credentials
- Browser plugins
- Python
- CatBoost
- Local database
- Local data-processing environment


============================================================
12. DASHBOARD AVAILABILITY
============================================================

The public interactive dashboard is hosted using Vercel.

Production URL:

https://databladez-tourism.vercel.app/

The dashboard is intended to remain publicly accessible
throughout the DOSM Datathon 2026 evaluation period.


============================================================
13. SUBMISSION FILES
============================================================

The dashboard submission should be considered together with
the team's other competition deliverables and supporting
materials.

Relevant dashboard materials include:

- Dashboard.pdf
- README.txt
- Interactive web dashboard
- Dashboard source code
- Supporting analytical data where applicable
- Supporting machine-learning outputs where applicable


============================================================
END OF README
============================================================