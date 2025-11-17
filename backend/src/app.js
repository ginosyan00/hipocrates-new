import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/app.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

/**
 * Express Application Setup
 */
const app = express();

// Security headers
app.use(helmet());

// CORS - Smart origin handling for development and production
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) {
        return callback(null, true);
      }

      // Development mode: allow all localhost origins
      if (config.nodeEnv === 'development') {
        const localhostRegex = /^http:\/\/localhost:\d+$/;
        if (localhostRegex.test(origin)) {
          console.log(`✅ [CORS] Allowed origin: ${origin}`);
          return callback(null, true);
        }
      }

      // Production mode or non-localhost: strict origin check
      if (config.corsOrigin === origin) {
        console.log(`✅ [CORS] Allowed origin: ${origin}`);
        return callback(null, true);
      }

      // Reject unauthorized origins
      console.log(`❌ [CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hippocrates Dental API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API v1 Routes
app.use('/api/v1', apiRoutes);

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hippocrates Dental API v1.0',
    version: '1.0.0',
    documentation: '/api/v1',
  });
});

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Hippocrates Dental API v1.0',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      public: {
        description: '🌐 Public endpoints (NO AUTH required)',
        cities: 'GET /api/v1/public/cities',
        clinics: 'GET /api/v1/public/clinics',
        clinicDetails: 'GET /api/v1/public/clinics/:slug',
        clinicDoctors: 'GET /api/v1/public/clinics/:slug/doctors',
        createAppointment: 'POST /api/v1/public/appointments',
      },
      auth: {
        description: '🔐 Authentication',
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        me: 'GET /api/v1/auth/me',
      },
      patients: {
        description: '👥 Patient management (AUTH required)',
        list: 'GET /api/v1/patients',
        get: 'GET /api/v1/patients/:id',
        create: 'POST /api/v1/patients',
        update: 'PUT /api/v1/patients/:id',
        delete: 'DELETE /api/v1/patients/:id',
        search: 'GET /api/v1/patients/search/phone?phone=xxx',
      },
      users: {
        description: '👨‍⚕️ Staff management (AUTH required)',
        list: 'GET /api/v1/users',
        doctors: 'GET /api/v1/users/doctors',
        get: 'GET /api/v1/users/:id',
        create: 'POST /api/v1/users',
        update: 'PUT /api/v1/users/:id',
        delete: 'DELETE /api/v1/users/:id',
      },
      appointments: {
        description: '📅 Appointment management (AUTH required)',
        list: 'GET /api/v1/appointments',
        get: 'GET /api/v1/appointments/:id',
        create: 'POST /api/v1/appointments',
        update: 'PUT /api/v1/appointments/:id',
        updateStatus: 'PATCH /api/v1/appointments/:id/status',
        delete: 'DELETE /api/v1/appointments/:id',
      },
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

