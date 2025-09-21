import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {

  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$YourHashedPasswordHere',
    }
  ];

  private initialized = false;

  constructor(private jwtService: JwtService) {
    this.initializeUsers();
  }

  private async initializeUsers() {
    if (this.initialized) return;

    for (const user of this.users) {
      if (user.password === '$2a$10$YourHashedPasswordHere') {
        user.password = await bcrypt.hash('password123', 10);
      }
    }
    this.initialized = true;
  }

  async validateUser(username: string, password: string): Promise<any> {
    await this.initializeUsers();

    const user = this.users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: 86400,
    };
  }

  async validateToken(payload: any): Promise<any> {
    await this.initializeUsers();

    const user = this.users.find(u => u.id === payload.sub);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
