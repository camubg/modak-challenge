import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as process from 'process';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey = process.env.API_KEY;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    if (apiKey && apiKey === this.validApiKey) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API Key');
    }
  }
}
