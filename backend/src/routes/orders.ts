import { Router } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

export const createOrderRoutes = (em: EntityManager) => {
  const router = Router();
  const orderController = new OrderController(em);

  router.post('/', authenticateToken, orderController.createOrder);
  router.get('/my-orders', authenticateToken, orderController.getUserOrders);
  router.get('/', authenticateToken, requireAdmin, orderController.getAllOrders);
  router.put('/:id/status', authenticateToken, requireAdmin, orderController.updateOrderStatus);

  return router;
};