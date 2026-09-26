import { BaseResponse } from './base';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  cartData?: Record<string, any>;
}

export type AuthResponse = BaseResponse<{ token: string }>;
