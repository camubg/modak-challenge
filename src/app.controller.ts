import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('AppMain')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Healthcheck',
  })
  @Get('/hello')
  getHello(): string {
    return `Hi :)`;
  }
}
