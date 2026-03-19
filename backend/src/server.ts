import app from './app';
import { env } from './config/env';
import prisma from './config/database';

const start = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('PostgreSQL connected');

    // Start server
    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`API: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
