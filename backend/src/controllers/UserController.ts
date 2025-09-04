import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  private userService: UserService;

  constructor(em: EntityManager) {
    this.userService = new UserService(em);
  }

  // Get all users (admin only)
  getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };

  // Get user by ID (admin or own profile)
  getUserById = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  };

  // Update user (admin or own profile)
  updateUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const updateData = req.body;

      // Users can only update their own profile unless they're admin
      if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Non-admin users cannot change their role
      if (req.user.role !== 'admin' && updateData.role) {
        return res.status(403).json({ message: 'Cannot change role' });
      }

      const updatedUser = await this.userService.updateUser(userId, updateData);
      
      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error: any) {
      console.error('Update user error:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(400).json({ message: error.message });
    }
  };

  // Delete user (admin only)
  deleteUser = async (req: AuthRequest, res: Response) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const userId = parseInt(req.params.id);
      
      // Prevent admin from deleting themselves
      if (req.user.id === userId) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      await this.userService.deleteUser(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('Delete user error:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to delete user' });
    }
  };

  // Get user profile (current user)
  getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  };
}