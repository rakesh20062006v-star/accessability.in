const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./mongodb/monoconnection');
const LoginRoutes = require('./loginbased/login');
const JobRoutes = require('./jobmanagment/jobapply');
const AddRoutes = require('./jobmanagment/addjob');
const ApplicationRouter = require('./jobmanagment/application');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:4173',   // Vite preview
  process.env.FRONTEND_URL, // Production Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Health Check (required by Render to detect server is alive) ──────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start ────────────────────────────────────────────────────────────────────
async function startServer() {
  await connectDB();

  app.use('/api/auth', LoginRoutes);
  app.use('/api/jobs', JobRoutes);
  app.use('/api/jobsadd', AddRoutes);
  app.use('/api/application', ApplicationRouter);

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
  });
}

startServer();