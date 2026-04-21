# Kondhwa Pharmacy Map Finder 💊

A modern, full-stack Medical Store Finder built for discovering real-time medicine availability around the Kondhwa, Pune area. This application merges geospatial SQL queries with a slick React interface to help customers effortlessly locate the drugs they need.

## 🚀 Advanced Features

* **Real-time Availability Map:** Visual pin mapping matching stores with your required medicine radius, updating stock metrics live.
* **Admin Dashboard Workspace:** A completely protected management tier allowing pharmacy networks to update catalog stock, patch store operational hours, and manage statistics. Secured by custom Token Verification middleware.
* **Multi-Medicine Cart Search:** Users can dump their entire prescription list into the "Cart Search" and the application sub-queries to find which single medical store contains the highest number of corresponding matches.
* **Smart Alternative Suggester:** If an item is completely out of stock across all geolocations, the app suggests in-stock alternatives belonging to the same medical category.
* **Category Hub Browser:** Easily jump between classes of medicines (Cardiology, Antibiotics, Pain Relief, etc.) using an icon-driven grid dashboard.
* **Live Store Fact-Sheets:** Every store has a dedicated profile detailing their full dynamic inventory ledger and operating hours, complete with native SVG pricing charts showcasing top items. 
* **Search History Memory:** Fast chip-driven history UI that uses browser LocalStorage to remember your most frequently searched medications.

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0 (Custom Haversine formulas for geospatial search)
- **Frontend:** React (Vite), React-Router-DOM
- **Map:** Leaflet.js 

---

## 💻 Getting Started

### 1) Database Configuration
Ensure **MySQL 8.0+** is installed to handle the specific SubQuery implementations needed for precise geo-location bounds.
You can bootstrap the database layout and 60+ seeded medicines straight from the CLI:

```sql
-- Login to MySQL CLI and run:
CREATE DATABASE IF NOT EXISTS online_medical_store_finder;
USE online_medical_store_finder;
SOURCE db/schema.sql;
SOURCE db/seed.sql;
```

### 2) Start the API Backend
Open a terminal in the `/backend` folder:
```bash
cd backend
npm install
# Make sure .env exists with:
# DB_USER=root
# DB_PASS=Root
# ADMIN_TOKEN=change-me
npm run dev
```
The Express server will start on `http://localhost:4000`.

### 3) Start the React Frontend
Open a terminal in the `/frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The React bundler will launch the website at `http://localhost:5173`.

---

## 🔐 Credentials & Testing

A mocked frontend authentication layer has been set up to demonstrate authorization routing dynamics:

| Role | Email | Admin Token | Use Case |
| :--- | :--- | :--- | :--- |
| **Customer** | demo@customer.com | *None* | Standard search, map discovery, category browsing. |
| **Admin** | demo@admin.com | `change-me` | Allowed entry to the `/admin` Dashboard to modify inventory. |

*Note: The Admin Token maps to the `ADMIN_TOKEN` variable housed in `/backend/.env`. Check config if you changed your root token (e.g. `'Root'`).*
