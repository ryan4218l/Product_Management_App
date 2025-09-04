import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { ProductService } from '../services/ProductService';
import { AuthRequest } from '../middleware/auth';

export class ProductController {
  private productService: ProductService;

  constructor(em: EntityManager) {
    this.productService = new ProductService(em);
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  createProduct = async (req: AuthRequest, res: Response) => {
    try {
      console.log("req.body:", req.body);
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateProduct = async (req: AuthRequest, res: Response) => {
    try {
      const product = await this.productService.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
      const result = await this.productService.deleteProduct(parseInt(req.params.id));
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}