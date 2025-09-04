import { NextFunction, Request, Response } from "express";

export const loggingMiddleware = (request: Request, response: Response, next: NextFunction) => {
  console.log(`${request.method} ${request.url}`);
  next();
};
