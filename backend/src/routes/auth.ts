import { Router } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { AuthController } from '../controllers/AuthController';
import { validateUserRegistration } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

export const createAuthRoutes = (em: EntityManager) => {
  const router = Router();
  const authController = new AuthController(em);

  router.post('/register', validateUserRegistration, authController.register);
  router.post('/login', authController.login);
  router.get('/profile', authenticateToken, authController.getProfile);

  return router;
};