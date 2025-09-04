import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/User';
import { UserDto } from '../types/dtos';

export class UserService {
  constructor(private em: EntityManager) {}

   private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.em.find(User, {});
    return users.map(user => this.toUserDto(user));
  }

  async getUserById(id: number): Promise<UserDto | null> {
    const user = await this.em.findOne(User, { id });
    return user ? this.toUserDto(user) : null;
  }

   async updateUser(id: number, updateData: Partial<User>): Promise<UserDto> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.em.findOne(User, { email: updateData.email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      user.email = updateData.email;
    }

    if (updateData.role) {
      user.role = updateData.role;
    }

    await this.em.flush();
    return this.toUserDto(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new Error('User not found');
    }

    await this.em.removeAndFlush(user);
  }
}