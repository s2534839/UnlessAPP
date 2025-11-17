import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import distanceRoutes from './routes/distance.js';
import emailRoutes from './routes/email.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/distance', distanceRoutes);
app.use('/api/email', emailRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SnailMail Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/distance/health',
      calculate: 'POST /api/distance/calculate',
      calculateAll: 'POST /api/distance/calculate-all',
      sendEmail: 'POST /api/email/send',
      emailStatus: 'GET /api/email/status/:jobId',
      emailJobs: 'GET /api/email/jobs',
    },
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SnailMail Backend running on http://localhost:${PORT}`);
  console.log(`📍 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🗺️  Google Maps API: ${process.env.GOOGLE_MAPS_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`🤖 Claude API: ${process.env.ANTHROPIC_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
});
