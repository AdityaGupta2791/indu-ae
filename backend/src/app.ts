import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './shared/middlewares/errorHandler';

// Import route modules
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import referenceRoutes from './modules/reference/reference.routes';
import tutorRoutes from './modules/tutor/tutor.routes';
import demoRequestRoutes from './modules/demo-request/demo-request.routes';
import courseRoutes from './modules/course/course.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import demoBookingRoutes from './modules/demo-booking/demo-booking.routes';
import classBookingRoutes from './modules/class-booking/class-booking.routes';
import applicationRoutes from './modules/application/application.routes';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,  // Allow cookies (refresh token)
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const apiPrefix = `/api/${env.API_VERSION}`;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}`, userRoutes);
app.use(`${apiPrefix}`, referenceRoutes);
app.use(`${apiPrefix}`, courseRoutes);  // Must come before tutorRoutes so /tutors/my-courses matches here first
app.use(`${apiPrefix}`, tutorRoutes);
app.use(`${apiPrefix}`, demoRequestRoutes);
app.use(`${apiPrefix}`, walletRoutes);
app.use(`${apiPrefix}`, demoBookingRoutes);
app.use(`${apiPrefix}`, classBookingRoutes);
app.use(`${apiPrefix}`, applicationRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
