import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('AppMain')
@Controller()
export class AppController {
  constructor() {}

  @ApiOperation({
    summary: 'Healthcheck',
  })
  @Get('/hello')
  getHello(): string {
    return `Hi :)`;
  }
}
