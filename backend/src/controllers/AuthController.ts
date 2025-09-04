import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  private authService: AuthService;

  constructor(em: EntityManager) {
    this.authService = new AuthService(em);
  }

  register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await this.authService.register(email, password, role);
        
        res.status(201).json({
            message: 'User registered successfully',
            user: { 
                id: result.user.id, 
                email: result.user.email, 
                role: result.user.role 
            },
            token: result.token
        });
    } catch (error: any) {
        console.error('Registration error:', error);
      
        // More specific error responses
        if (error.message.includes('already exists')) {
        return res.status(409).json({ message: error.message });
        }
      
        res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await this.authService.login(email, password);
        
        res.json({
            message: 'Login successful',
            user: { 
                id: result.user.id, 
                email: result.user.email, 
                role: result.user.role 
            },
            token: result.token
        });
    } catch (error: any) {
        console.error('Login error:', error);
      
        // Don't reveal too much information about authentication failures
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
      
        res.status(401).json({ message: error.message });
    }
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
            }
        });
    } catch (error: any) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
}