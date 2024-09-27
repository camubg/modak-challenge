import {
  Body,
  Controller,
  Inject,
  Logger,
  LoggerService,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login to be able to use the app',
  })
  loginUser(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    this.logger.log(`User ${authCredentialsDTO.username} is trying to log in`);
    return this.authService.loginUser(authCredentialsDTO);
  }
}
