import { EntityManager } from '@mikro-orm/core';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export class OrderService {
  constructor(private em: EntityManager) {}

  async createOrder(userId: number, items: OrderItemRequest[]) {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
        throw new Error('User not found');
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.em.findOne(Product, { id: item.productId });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // Update product stock
      product.stock -= item.quantity;

      const orderItem = new OrderItem(
        {} as Order, // Will be set after order creation
        product,
        item.quantity,
        product.price
      );

      orderItems.push(orderItem);
    }

    const order = new Order(user, totalAmount, 'pending');
    await this.em.persist(order);

    // Set order reference for each order item
    orderItems.forEach(item => {
      item.order = order;
      order.orderItems.add(item);
    });

    await this.em.persistAndFlush(orderItems);
    await this.em.flush();

    return order;
  }

  async getUserOrders(userId: number) {
    return await this.em.find(Order, { user: userId }, { populate: ['orderItems', 'orderItems.product'] });
  }

  async getAllOrders() {
    return await this.em.find(Order, {}, { populate: ['user', 'orderItems', 'orderItems.product'] });
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.em.findOne(Order, { id });
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await this.em.flush();
    return order;
  }
}