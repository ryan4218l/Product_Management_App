import { Router } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateProduct } from '../middleware/validation';

export const createProductRoutes = (em: EntityManager) => {
  const router = Router();
  const productController = new ProductController(em);

  router.get('/', productController.getAllProducts);
  router.get('/:id', productController.getProduct);
  router.post('/', authenticateToken, requireAdmin, validateProduct, productController.createProduct);
  router.put('/:id', authenticateToken, requireAdmin, validateProduct, productController.updateProduct);
  router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

  return router;
};