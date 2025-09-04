import express from 'express';
import cors from 'cors';
import { MikroORM } from '@mikro-orm/core';
import { createUserRoutes } from './routes/users';
import { createAuthRoutes } from './routes/auth';
import { createProductRoutes } from './routes/products';
import { createOrderRoutes } from './routes/orders';
import { requestLogger } from './middleware/logger';

declare global {
  namespace Express {
    interface Request {
        em?: any;
    }
  }
}

export const initApp = async (orm: MikroORM) => {
  const app = express();

// Middleware
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use((req, res, next) => {
        req.em = orm.em.fork(); // Create a fresh EM instance for each request
        next();
  });

  // Routes
  app.use('/api/auth', createAuthRoutes(orm.em));
  app.use('/api/users', createUserRoutes(orm.em));
  app.use('/api/products', createProductRoutes(orm.em));
  app.use('/api/orders', createOrderRoutes(orm.em));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        message: 'Product Management API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
  });

  // Error handling middleware
  app.use((error: any, req: any, res: any, next: any) => {
    console.error('Error:', error);
    res.status(error.status || 500).json({ 
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  });

  // API documentation endpoint
  app.get('/api', (req, res) => {
    res.json({
      message: 'Product Management API',
      endpoints: {
        auth: {
            'POST /api/auth/register': 'Register a new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/auth/profile': 'Get user profile (requires auth)'
        },
        products: {
            'GET /api/products': 'Get all products',
            'GET /api/products/:id': 'Get single product',
            'POST /api/products': 'Create product (admin only)',
            'PUT /api/products/:id': 'Update product (admin only)',
            'DELETE /api/products/:id': 'Delete product (admin only)'
        },
        orders: {
            'POST /api/orders': 'Create order (requires auth)',
            'GET /api/orders/my-orders': 'Get user orders (requires auth)',
            'GET /api/orders': 'Get all orders (admin only)',
            'PUT /api/orders/:id/status': 'Update order status (admin only)'
        }
      }
    });
  });

  // 404 handler
  app.use('/{*any}', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.originalUrl
    });
  });

  // Error handling middleware - MUST COME AFTER ALL ROUTES AND 404 HANDLER
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  
  // Database errors
  if (error.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ message: 'Resource already exists' });
  }
  
  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }
  
  // Default error
  res.status(error.status || 500).json({ 
    message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

  return app;
};