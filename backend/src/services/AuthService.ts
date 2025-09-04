import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/User';

export class AuthService {
  constructor(private em: EntityManager) {}

  async register(email: string, password: string, role: string = 'customer') {
    const existingUser = await this.em.findOne(User, { email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User(email, hashedPassword, role);
    
    await this.em.persistAndFlush(user);
    
    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.em.findOne(User, { email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: User) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
  }
}