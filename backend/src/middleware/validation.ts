import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number' });
  }
  
  next();
};

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};