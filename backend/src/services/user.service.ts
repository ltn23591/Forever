import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { UserModel } from '../models/user.model';
import config from '../config';
import { AppError } from '../utils/AppError';
import { ResponseHelper } from '../utils/ResponseHelper';

export class UserService {
  private createToken(id: string): string {
    return jwt.sign({ id }, config.jwtSecret);
  }

  async login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw AppError.badRequest('Email and password are required');
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return ResponseHelper.error("User doesn't exists", 'USER_NOT_FOUND', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = this.createToken(user._id.toString());
      return ResponseHelper.success(null, 'Login successful', { token });
    } else {
      return ResponseHelper.error('Invalid credentials', 'INVALID_CREDENTIALS', 400);
    }
  }

  async register(body: any) {
    const { name, email, password } = body;

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return ResponseHelper.error('User already exists', 'USER_EXISTS', 400);
    }

    if (!validator.isEmail(email)) {
      return ResponseHelper.error('Please enter a valid email', 'INVALID_EMAIL', 400);
    }

    if (password.length < 8) {
      return ResponseHelper.error('Please enter a strong password', 'WEAK_PASSWORD', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = this.createToken(user._id.toString());

    return ResponseHelper.success(null, 'User registered successfully', { token });
  }

  async adminLogin(body: any) {
    const { email, password } = body;

    if (email === config.adminEmail && password === config.adminPassword) {
      const token = jwt.sign(email + password, config.jwtSecret);
      return ResponseHelper.success(null, 'Admin login successful', { token });
    } else {
      return ResponseHelper.error('Invalid credentials', 'INVALID_CREDENTIALS', 400);
    }
  }
}

export const userService = new UserService();
