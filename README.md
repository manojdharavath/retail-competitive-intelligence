# Retail Competitive Intelligence Dashboard 🚀

> **Bridge AI AIML Evaluation Project — Multi-Brand E-Commerce Benchmark**  
> *A clean, full-stack multi-brand competitive intelligence platform tracking pricing, promotions, shelf visibility, search voice, and page compliance across computing industry leaders.*

---

## 📌 Project Overview
The **Retail Competitive Intelligence Dashboard** tracks daily retail metrics for computing chip brands (**Intel**, **AMD**, **Qualcomm**, **Apple**) across leading OEMs (**Dell**, **HP**, **Lenovo**, **Acer**, **Asus**, **MSI**, **Apple**) and retail platforms (**Newegg US**, **Mercado Libre Brazil**).

Instead of single-brand tracking, this platform provides a fair, side-by-side comparative benchmark measuring how each brand shows up in retail: **pricing, promotional markdowns, shelf share, search ranking position, homepage banner dominance, and retailer page compliance**.

---

## 🎯 Scope & Attribution Rules (PDF Compliant)

| Category | Specification Scope |
| :--- | :--- |
| **Industry** | Gaming Segment |
| **Tracked Brands** | Intel, AMD, Qualcomm, Apple |
| **Tracked OEMs** | Dell, HP, Lenovo, Acer, Asus, MSI, Apple |
| **Tracked Websites** | Newegg (US), Mercado Libre (Brazil) |
| **Product Types** | Notebooks, Desktops, Workstations, Tablets, CPU/GPU Components |
| **Exclusions** | Accessories (Monitors, Keyboards, Cameras, Gift Cards) |
| **Brand Attribution Logic** | • **Brand**: Chip/SoC supplier (`Intel`, `AMD`, `Qualcomm`, `Apple`)<br>• **OEM**: Computer maker (`Dell`, `HP`, `Lenovo`, etc.)<br>• **Apple Products**: Same entity in both fields (`Brand: Apple`, `OEM: Apple`)<br>• **CPU/GPU Standalone Components**: `OEM = N/A` (No PC maker attached) |

---

## ✨ Key Features & Measurements

- **📊 Executive Benchmark Dashboard**: Real-time KPIs for Total Products, Average Price, Average Discount %, Share of Shelf Leader, Compliance Leader, and Active Promotions.
- **🏆 Composite Brand Competitiveness Index**: A 0–100 rankable composite score rolling up Share of Shelf (30%), Compliance Score (30%), Pricing Competitiveness (20%), and Banner Share (20%).
- **⚡ Real-Time Anomaly & Alerts**: Dynamic flags for sharp price drops ($>20\%$), compliance drops ($<85\%$), and banner dominance shifts.
- **💰 Pricing & Promotional Intelligence**: Deep-dive tracking average/min/max price spectrums, discount depth %, 30-day market price trend lines (with distinct brand colors), and flash sale badges.
- **🛡️ 7-Point Retailer Compliance Audit**: Page-level compliance rubric (S1-S2 listing tile checks, P1-P5 product page checks) weighted **85% Notebook / 15% Desktop**.
- **🖼️ Homepage Banner Tracking**: Daily monitoring of prime retail real estate, banner share, and active brand promotional campaigns.
- **🔎 Share of Voice (Search Visibility)**: Rank tracking (#1 to #10) per brand across keywords (e.g. `"gaming laptop"`, `"AI PC"`).
- **🏷️ SKU Explorer & Product Catalog**: Searchable product table with instant filtering by CPU, GPU, OEM, brand, and retail platform + **CSV Exporter**.
- **🤖 Gemini AI Assistant**: Natural language Q&A interface powered by **Google Gemini 1.5 Flash** using Retrieval-Augmented Generation (RAG) over real MongoDB metrics.
- **📱 Fully Responsive UI**: Responsive sidebar drawer with mobile backdrop blur and hamburger menu navigation toggle.

---

## 🎨 High-Contrast Brand Color Palette

To ensure clear visual distinction on trend charts, legends, and graphs:
* **Intel**: Royal Blue (`#0068B5`)
* **AMD**: Crimson Red (`#ED1C24`)
* **Qualcomm**: Vibrant Purple (`#9333EA`)
* **Apple**: Slate Dark Gray (`#475569`)

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** (Vite build engine)
- **Tailwind CSS** (responsive utility styling)
- **Lucide React** (modern iconography)
- **Recharts** (interactive data visualizer)
- **React Router DOM v6** (SPA page routing)
- **Axios** (REST API HTTP client)

### Backend
- **Node.js** & **Express.js** (REST API server)
- **MongoDB** & **Mongoose ORM** (schema models & aggregations)
- **MongoDB Memory Server** (zero-config, instant local fallback DB)
- **@google/generative-ai** (Google Gemini 1.5 Flash SDK)

---

## 📂 Project Structure

```
retail-competitive-intelligence/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB / MongoMemoryServer connection handler
│   ├── models/
│   │   ├── Product.js            # SKU schema with Brand & OEM attributes
│   │   ├── PriceHistory.js       # 30-day daily price flux records
│   │   ├── RetailerAudit.js      # S1-S2 & P1-P5 compliance rubric checks
│   │   ├── Banner.js             # Homepage banner tracking schema
│   │   └── SearchVisibility.js   # Search keyword ranking position schema
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── aiRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── analyticsController.js
│   │   └── aiController.js
│   ├── services/
│   │   ├── analyticsService.js   # MongoDB aggregation pipelines & rollup logic
│   │   └── geminiService.js      # Gemini API + RAG prompt context & fallback engine
│   ├── scrapers/
│   │   ├── neweggScraper.js      # Newegg e-commerce scraper module
│   │   └── mercadoLivreScraper.js # Mercado Libre e-commerce scraper module
│   ├── seed/
│   │   └── seedData.js           # Multi-brand catalog seed script
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Clean header with mobile menu toggle
│   │   │   ├── Sidebar.jsx       # Fixed desktop sidebar & mobile slide-out drawer
│   │   │   ├── FilterBar.jsx     # Dynamic multi-attribute filter bar
│   │   │   ├── MetricCard.jsx    # Overflow-safe KPI card component
│   │   │   └── ProductTable.jsx  # Searchable product data grid
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
│   │   │   └── exportUtils.js    # CSV export utility
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## ⚡ Setup & Local Execution

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If `MONGODB_URI` is blank, the server automatically starts an in-memory MongoDB server. If `GEMINI_API_KEY` is not provided, the AI Assistant uses the deterministic MongoDB analytics fallback engine).*

### 3. Run the Servers

**Backend API**:
```bash
cd backend
npm run dev
```

**Frontend Application**:
```bash
cd frontend
npm run dev
```

* **Frontend Web App**: `http://localhost:3000`
* **Backend API Health Check**: `http://localhost:5000/api/health`

---

## 📄 License & Attribution
Developed for **Bridge AI AIML Evaluation Project**.
