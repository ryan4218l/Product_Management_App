import { Router } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

export const createUserRoutes = (em: EntityManager) => {
  const router = Router();
  const userController = new UserController(em);

  // Admin only routes
  router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);
  router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

  // User management routes (admin or own profile)
  router.get('/profile', authenticateToken, userController.getCurrentUser);
  router.get('/:id', authenticateToken, userController.getUserById);
  router.put('/:id', authenticateToken, userController.updateUser);

  return router;
};