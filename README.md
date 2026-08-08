# Retail Competitive Intelligence Dashboard 🚀

> **Bridge AI AIML Intern Evaluation Project Prototype**  
> *A clean, full-stack multi-brand benchmark platform comparing pricing, promotions, search visibility, and listing compliance across computing leaders.*

---

## 📌 Project Overview
The **Retail Competitive Intelligence Dashboard** tracks daily retail metrics for computing brands (**Intel**, **AMD**, **Qualcomm**, **Apple**) across leading OEMs (**Dell**, **HP**, **Lenovo**, **Acer**, **Asus**, **MSI**, **Apple**) and retailers (**Newegg US**, **Mercado Libre Brazil**).

This application moves beyond single-brand analytics by offering a fair, comparative side-by-side benchmark to empower retail and marketing teams with actionable business insights.

---

## 🎯 Problem Statement
In retail electronics, purchasing decisions are directly driven by real-time pricing, promotional markdowns, and listing compliance. Historically, tracking rival brand positioning across multiple platforms was a manual black box. This prototype provides an automated, daily view of share of shelf, price trends, listing compliance, banner prominence, and search voice.

---

## ✨ Features

- **📊 Interactive Executive Dashboard**: Live KPIs (Total Products, Avg Price, Avg Discount, Share of Shelf Leader, Compliance Leader, Active Promotions) with interactive Recharts diagrams.
- **🏆 Composite Brand Competitiveness Index**: 0–100 rankable score rolling up pricing, visibility, compliance, banner share, and search voice.
- **⚡ Real-Time Anomaly & Alerts**: Live flags for sharp price drops ($>20\%$), compliance drops ($<85\%$), and homepage banner dominance shifts.
- **🏷️ SKU Explorer & Product Catalog**: Searchable product table with instant filtering by CPU, GPU, OEM, brand, and retail platform + **CSV Exporter**.
- **💰 Dedicated Pricing & Promotional Intelligence**: Deep-dive page tracking min/avg/max price range spectrums, discount depth %, 30-day market price trend lines, and active deals catalog.
- **🔍 SKU Detail & Price History**: Individual product view featuring technical specs, detected tier/certification badges, retailer compliance audit checks, and a 30-day historical price line chart.
- **⚖️ Side-by-Side Brand Comparison**: Benchmark matrix comparing Intel vs AMD vs Qualcomm vs Apple across all 7 core retail metrics + **CSV Exporter**.
- **🛡️ 7-Point Retailer Compliance Audit**: Page-level audit rubric (S1-S2 listing tile checks, P1-P5 product page checks) using Bridge AI's **85% Notebook / 15% Desktop** weighted score calculation with rubric legend.
- **🖼️ Homepage Banner Tracking**: Daily monitoring of prime retail real estate, banner share, and active brand promotional campaigns.
- **🔎 Share of Voice (Search Visibility)**: Keyword ranking positions (#1 to #10) per brand across search pages.
- **🤖 Gemini AI Assistant**: Natural language Q&A interface where the backend aggregates MongoDB metrics into context before feeding to Gemini AI for clear, zero-hallucination explanations.
- **🕸️ Modular Scraper Architecture**: Structured Playwright scrapers for Newegg and Mercado Libre data ingestion.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite build engine)
- **Tailwind CSS** & **Lucide React** (modern UI styling & icons)
- **Recharts** (data visualization & charts)
- **React Router DOM v6** (SPA routing)
- **Axios** (REST API client)

### Backend
- **Node.js** & **Express.js** (REST API server)
- **MongoDB** & **Mongoose** (schema-based database)
- **MongoDB Memory Server** (zero-config, out-of-the-box fallback)
- **@google/generative-ai** (Gemini AI integration)
- **Playwright** (web scraping structure)

---

## 📂 Project Architecture

```
retail-competitive-intelligence/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongo / MongoMemoryServer fallback
│   ├── models/
│   │   ├── Product.js
│   │   ├── PriceHistory.js
│   │   ├── RetailerAudit.js
│   │   ├── Banner.js
│   │   └── SearchVisibility.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── aiRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── analyticsController.js
│   │   └── aiController.js
│   ├── services/
│   │   ├── analyticsService.js   # MongoDB aggregation pipelines & competitiveness engine
│   │   └── geminiService.js      # Gemini API + metric context prompt
│   ├── scrapers/
│   │   ├── neweggScraper.js
│   │   └── mercadoLivreScraper.js
│   ├── seed/
│   │   └── seedData.js           # Realistic data generator
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   └── ProductTable.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── BrandComparison.jsx
│   │   │   ├── PricingPromotions.jsx
│   │   │   ├── Compliance.jsx
│   │   │   ├── Banners.jsx
│   │   │   ├── SearchVisibility.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── utils/
│   │   │   └── exportUtils.js    # CSV Exporter utility
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```


---

## 📡 API Endpoints

- `GET /api/products` — Filter products by brand, oem, retailer, country, type, or search term
- `GET /api/products/:id` — Get product detail with price history & compliance audits
- `GET /api/analytics/summary` — Aggregate KPIs and dynamic text insights
- `GET /api/analytics/share-of-shelf` — Brand product count and catalog percentage
- `GET /api/analytics/pricing` — Average price, min price, max price, avg discount
- `GET /api/analytics/promotions` — Discount depth and discounted product volume
- `GET /api/analytics/compliance` — Weighted compliance scores (85% Notebook / 15% Desktop)
- `GET /api/analytics/competitiveness` — Composite 0-100 Brand Competitiveness Index score rollup
- `GET /api/analytics/alerts` — Real-time sharp price drop & listing compliance anomaly flags
- `GET /api/analytics/banners` — Banner count & homepage share percentage
- `GET /api/analytics/search` — Keyword ranking positions per brand
- `POST /api/ai/query` — Execute MongoDB aggregation & submit prompt context to Gemini
- `GET /api/health` — API status check


---

## ⚡ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `MONGODB_URI` is left blank, the backend automatically uses `mongodb-memory-server` so it runs anywhere without setup! If `GEMINI_API_KEY` is not provided, the AI Assistant provides deterministic database explanations).*

### 3. Seed Demo Data

```bash
cd backend
npm run seed
```

### 4. Running the Application

Start Backend API (Terminal 1):
```bash
cd backend
npm run dev
```

Start Frontend App (Terminal 2):
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## ⚠️ Prototype Limitations & Future Improvements
- **Prototype Dataset**: Uses seeded data (~75 products, 525 price history entries, audit records) to demonstrate full platform capabilities cleanly.
- **Scraper Execution**: Playwright scrapers are structured modularly in `backend/scrapers/` ready for production deployment with proxy rotation.
- **Future Enhancements**: Add daily email alert triggers on sharp price drops, automated OCR for banner images, and exportable PDF/Excel reports.

---

## 👨‍💻 Author
Developed for **Bridge AI AIML Intern Evaluation Project**.
