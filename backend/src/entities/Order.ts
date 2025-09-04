import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Property({ default: 'pending' })
  status!: string; // 'pending', 'processing', 'completed', 'cancelled'

   @OneToMany(() => OrderItem, orderItem => orderItem.order, { 
    cascade: [Cascade.PERSIST, Cascade.REMOVE] 
  })
  orderItems = new Collection<OrderItem>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(user: User, totalAmount: number, status: string = 'pending') {
    this.user = user;
    this.totalAmount = totalAmount;
    this.status = status;
  }
}