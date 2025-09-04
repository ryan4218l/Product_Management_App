import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { OrderService } from '../services/OrderService';
import { AuthRequest } from '../middleware/auth';

export class OrderController {
  private orderService: OrderService;

  constructor(em: EntityManager) {
    this.orderService = new OrderService(em);
  }

  createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { items } = req.body;
        
        const order = await this.orderService.createOrder(req.user.id, items);
        
        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
  };

  getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
      const orders = await this.orderService.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(parseInt(req.params.id), status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}