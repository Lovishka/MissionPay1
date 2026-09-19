# MissionPay - AI-Powered Local Commerce Autopilot

MissionPay is an intelligent platform that helps local merchants optimize their business operations using AI-driven insights, demand forecasting, and automated campaign management.

## 🚀 Features

- **AI Goal Planner**: Converts business goals into actionable plans
- **Demand Radar**: ML-powered demand forecasting for inventory optimization
- **Festival Commerce Intelligence**: Analyzes seasonal demand patterns for Indian festivals
- **Weather-Based Insights**: Real-time weather analysis for demand prediction
- **Smart Offer Engine**: Generates and evaluates promotional offers with guardrails
- **Opportunity Detection**: Identifies local commerce opportunities based on events and trends
- **Automated Mission Control**: AI agents manage campaigns end-to-end

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS 4
- Lucide Icons

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL / SQLite
- Scikit-learn for ML
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (optional, falls back to SQLite)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Lovishka/MissionPay1.git
cd missionpay
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

5. **Run the application**

Terminal 1 (Backend):
```bash
cd backend
python -m uvicorn main:app --reload
```

Terminal 2 (Frontend):
```bash
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🚢 Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway/Render (Backend)

#### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite configuration
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL
6. Deploy!

#### Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your repository
4. Railway will detect Python and use the Procfile
5. Add environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (Railway provides this)
   - `SECRET_KEY`: Generate a secure key
   - `ALGORITHM`: HS256
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: 30
6. Add PostgreSQL database from Railway marketplace
7. Deploy!

#### Deploy Backend to Render

1. Go to [Render](https://render.com)
2. Create New → Web Service
3. Connect your GitHub repository
4. Use these settings:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Create PostgreSQL database (Render provides free tier)
7. Deploy!

### Option 2: Docker Deployment

```bash
# Build backend image
docker build -t missionpay-backend .

# Run backend container
docker run -p 8000:8000 \
  -e DATABASE_URL="your-db-url" \
  -e SECRET_KEY="your-secret-key" \
  missionpay-backend

# Build and run frontend
npm run build
npx serve -s dist -p 5173
```

### Option 3: Full Render Deployment

Use the included `render.yaml` for one-click deployment on Render with both frontend and backend.

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/missionpay
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENWEATHER_API_KEY=optional-for-weather-features
PREDICTHQ_ACCESS_TOKEN=optional-for-event-features
```

### Frontend Environment Variables

Create `.env` in project root (optional):

```env
VITE_API_URL=http://127.0.0.1:8000
```

## 📊 Data Upload

The platform supports CSV uploads for:

1. **Sales Data**: Historical sales records for demand forecasting
2. **Product Economics**: Pricing, costs, and discount limits

Upload CSV files through the Onboarding flow or Dashboard.

## 🧪 Testing

```bash
# Frontend
npm run lint

# Backend
cd backend
pytest  # (if tests are added)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FastAPI for the amazing Python web framework
- React team for the powerful UI library
- Scikit-learn for machine learning capabilities
- OpenWeather & PredictHQ for external data APIs

## 📧 Contact

For questions or support, reach out to [Lovishka](https://github.com/Lovishka)

---

**Built with ❤️ for local merchants across India**
