import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './dto/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: '$2b$10$EsGcfHv18IoVUJUT6GAIAOrA45QIG9pFXOrcztoQX1qt/git7XU/C',
      email: 'admin@admin',
      isActive: true,
    },
  ];

  async findOne(username: string): Promise<User> {
    return this.users.find(user => user.username === username);
  }

  async loginUser(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;

    const user = await this.findOne(username);

    if (user && (await this.passwordsMatch(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException(`Username or password is incorrect`);
  }

  private async passwordsMatch(inputPassword: string, storePassword: string) {
    return await bcrypt.compare(inputPassword, storePassword);
  }
}
