import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ResponseHelper } from '../utils/ResponseHelper';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = (req.headers.token as string) || (req.headers.authorization?.split(' ')[1] as string);
    if (!token) {
      res.status(401).json(ResponseHelper.error('Not Authorized Login Again', 'UNAUTHORIZED', 401));
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as string;
    const expected = config.adminEmail + config.adminPassword;

    if (decoded !== expected) {
      res.status(401).json(ResponseHelper.error('Not Authorized Login Again', 'UNAUTHORIZED', 401));
      return;
    }

    next();
  } catch (error: any) {
    res.status(401).json(ResponseHelper.error('Not Authorized Login Again', 'UNAUTHORIZED', 401));
  }
};

export const authUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.token) {
      token = req.headers.token as string;
    } else if (req.body && req.body.token) {
      token = req.body.token;
    }

    if (!token) {
      res.status(401).json(ResponseHelper.error('Not Authorized Login Again', 'UNAUTHORIZED', 401));
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    req.user = { userId: decoded.id };
    req.userId = decoded.id;
    if (req.body) {
      req.body.userId = decoded.id;
    }
    next();
  } catch (error: any) {
    res.status(401).json(ResponseHelper.error(error.message || 'Not Authorized Login Again', 'UNAUTHORIZED', 401));
  }
};
