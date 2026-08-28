import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: any) {
    try {
      return await this.usersService.login(body);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('register')
  async register(@Body() body: any) {
    try {
      return await this.usersService.register(body);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }

  @Post('admin')
  async adminLogin(@Body() body: any) {
    try {
      return await this.usersService.adminLogin(body);
    } catch (error) {
      return { success: false, msg: error.message };
    }
  }
}
