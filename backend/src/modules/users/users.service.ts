import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import validator from 'validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private createToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  }

  async login(body: any) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { success: false, msg: "User doesn't exists" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = this.createToken(user._id.toString());
      return { success: true, token };
    } else {
      return { success: false, msg: 'Ivalid credentials' };
    }
  }

  async register(body: any) {
    const { name, email, password } = body;

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      return { success: false, msg: 'User already exists' };
    }

    if (!validator.isEmail(email)) {
      return { success: false, msg: 'Please enter a valid email' };
    }

    if (password.length < 8) {
      return { success: false, msg: 'Please enter a strong password' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = this.createToken(user._id.toString());

    return { success: true, token };
  }

  async adminLogin(body: any) {
    const { email, password } = body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return { success: true, token };
    } else {
      return { success: false, msg: 'Invalid credentials' };
    }
  }
}
