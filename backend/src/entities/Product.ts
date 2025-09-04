import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { OrderItem } from './OrderItem';

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property({ default: 0 })
  stock!: number;

  @Property({ nullable: true })
  imageUrl?: string;

  @Property()
  category!: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.product, { 
    cascade: [Cascade.PERSIST, Cascade.REMOVE] 
  })
  orderItems = new Collection<OrderItem>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(name: string, price: number, stock: number = 0, category: string, description?: string, imageUrl?: string) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}