import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { Order } from './Order';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ default: 'customer' })
  role!: string; // 'admin' or 'customer'

    @OneToMany(() => Order, order => order.user, { 
    cascade: [Cascade.PERSIST, Cascade.REMOVE] 
  })
  orders = new Collection<Order>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(email: string, password: string, role: string = 'customer') {
    this.email = email;
    this.password = password;
    this.role = role;
  }
}