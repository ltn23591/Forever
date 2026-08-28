import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.headers.token as string;
    if (!token) {
      response.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
      return false;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as string;
      const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
      if (decoded !== expected) {
        response.json({
          success: false,
          message: 'Not Authorized Login Again',
        });
        return false;
      }
      return true;
    } catch (error) {
      response.json({
        success: false,
        message: 'Not Authorized Login Again',
      });
      return false;
    }
  }
}
