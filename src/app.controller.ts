import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('healthcheck')
export class AppController {
  @Get()
  root() {
    return HttpStatus.OK;
  }
}
