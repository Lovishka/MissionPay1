# MissionPay Deployment Guide

## Quick Deploy Options

### 🟣 Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

This is the easiest and fastest deployment method.

#### Step 1: Deploy Backend to Railway

1. Visit [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **MissionPay1** repository
5. Railway will automatically detect Python and deploy using `Procfile`
6. **Add PostgreSQL Database:**
   - Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will automatically set `DATABASE_URL` environment variable
7. **Add Environment Variables:**
   - Go to **"Variables"** tab
   - Add the following:
     ```
     SECRET_KEY=your-random-secure-secret-key-min-32-chars
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ```
   - Generate SECRET_KEY using: `openssl rand -hex 32`
8. **Get Backend URL:**
   - Go to **"Settings"** tab
   - Under **"Domains"**, copy the generated URL (e.g., `https://missionpay-production.up.railway.app`)

#### Step 2: Deploy Frontend to Vercel

1. Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import **MissionPay1** repository
4. Vercel will auto-detect Vite
5. **Add Environment Variable:**
   - Add: `VITE_API_URL` = Your Railway backend URL (from Step 1)
   - Example: `https://missionpay-production.up.railway.app`
6. Click **"Deploy"**
7. Your app will be live at `https://your-app.vercel.app`

#### Step 3: Update CORS in Backend

After deployment, update your backend's CORS settings:

1. Go to Railway project
2. Navigate to your backend service
3. Add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Or manually edit `backend/main.py` to allow your Vercel domain in CORS

---

### 🟦 Option 2: Render (Full Stack)

Deploy both frontend and backend on Render.

#### Using render.yaml (One-Click Deploy)

1. Visit [render.com](https://render.com) and sign in
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and set up:
   - Backend web service
   - Frontend static site
   - PostgreSQL database
5. Add environment variables when prompted
6. Deploy!

#### Manual Render Deployment

**Backend:**
1. **New** → **Web Service**
2. Connect repository
3. Settings:
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3
4. Add environment variables
5. Create PostgreSQL database (free tier available)

**Frontend:**
1. **New** → **Static Site**
2. Connect repository
3. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add `VITE_API_URL` environment variable

---

### 🐳 Option 3: Docker + Any Cloud Provider

#### Build and Deploy Backend

```bash
# Build Docker image
docker build -t missionpay-backend .

# Tag for your registry (e.g., Docker Hub, AWS ECR)
docker tag missionpay-backend your-registry/missionpay-backend:latest

# Push to registry
docker push your-registry/missionpay-backend:latest

# Deploy to your cloud (AWS ECS, Google Cloud Run, etc.)
```

#### Deploy Frontend

```bash
# Build frontend
npm run build

# Deploy dist/ folder to:
# - AWS S3 + CloudFront
# - Netlify
# - Vercel
# - Any static hosting
```

---

### 🟠 Option 4: Fly.io (Backend) + Netlify (Frontend)

#### Deploy Backend to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create `fly.toml`:
```toml
app = "missionpay-backend"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"
  ALGORITHM = "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES = "30"

[[services]]
  http_checks = []
  internal_port = 8000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```
4. Deploy: `fly deploy`
5. Add secrets: `fly secrets set SECRET_KEY=your-key`
6. Attach Postgres: `fly postgres create`

#### Deploy Frontend to Netlify

1. Visit [netlify.com](https://netlify.com)
2. Drag & drop `dist/` folder OR connect GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=your-fly-backend-url`

---

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | JWT secret (32+ chars) | `your-secret-key` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `30` |

### Backend Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENWEATHER_API_KEY` | Weather API key | `your-api-key` |
| `PREDICTHQ_ACCESS_TOKEN` | Events API token | `your-token` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.example.com` |

---

## Post-Deployment Checklist

- [ ] Backend is accessible at your deployment URL
- [ ] Frontend can reach backend API
- [ ] CORS is properly configured
- [ ] Database migrations have run
- [ ] Environment variables are set correctly
- [ ] SSL/HTTPS is enabled
- [ ] User registration works
- [ ] User login works
- [ ] CSV upload functionality works
- [ ] All API endpoints return expected responses

---

## Troubleshooting

### CORS Errors
- Ensure frontend URL is in backend's CORS allowed origins
- Check `backend/main.py` CORS middleware configuration

### Database Connection Errors
- Verify `DATABASE_URL` format is correct
- Check database credentials
- Ensure database allows connections from deployment IP

### Build Failures
- Check Node.js version (18+)
- Check Python version (3.11+)
- Verify all dependencies are in package.json / requirements.txt

### 502 Bad Gateway
- Check backend logs for errors
- Ensure backend is running on correct PORT
- Verify start command is correct

---

## Monitoring & Logs

### Railway
- View logs in Railway dashboard
- Set up log drains for external monitoring

### Render
- Logs available in service dashboard
- Configure log retention settings

### Vercel
- Real-time logs in Vercel dashboard
- Function logs for serverless functions

---

## Cost Estimates

### Free Tier Options
- **Railway:** $5 free credit/month (hobby plan)
- **Render:** Free tier with limitations
- **Vercel:** Free for personal projects
- **Netlify:** Free tier with 100GB bandwidth

### Recommended Paid Plans
- **Railway:** $5-20/month for production
- **Render:** $7-25/month per service
- **Vercel:** $20/month pro plan

---

## Security Recommendations

1. **Change default SECRET_KEY** - Never use default values in production
2. **Use environment variables** - Never commit secrets to Git
3. **Enable HTTPS** - All modern platforms provide this by default
4. **Set strong passwords** - For database and admin accounts
5. **Regular updates** - Keep dependencies up to date
6. **Rate limiting** - Consider adding rate limiting to API
7. **Input validation** - FastAPI provides this, ensure it's enabled

---

## Need Help?

- Check Railway/Render/Vercel documentation
- Open an issue on GitHub
- Review backend logs for error messages
- Test locally first before deploying

---

**Happy Deploying! 🚀**
