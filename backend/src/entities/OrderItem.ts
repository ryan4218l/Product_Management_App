import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './Order';
import { Product } from './Product';

@Entity()
export class OrderItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => Product)
  product!: Product;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number; // Price at the time of purchase

  @Property()
  createdAt: Date = new Date();

  constructor(order: Order, product: Product, quantity: number, price: number) {
    this.order = order;
    this.product = product;
    this.quantity = quantity;
    this.price = price;
  }
}