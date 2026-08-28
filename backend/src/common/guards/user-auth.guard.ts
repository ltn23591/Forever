import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      response.json({
        success: false,
        msg: 'Not Authorized Login Again',
      });
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      request.user = { userId: decoded.id };
      request.body.userId = decoded.id;
      return true;
    } catch (error) {
      response.json({
        success: false,
        msg: error.message || 'Not Authorized Login Again',
      });
      return false;
    }
  }
}
