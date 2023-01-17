import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('health')
@ApiTags('healthcheck')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return HttpStatus.OK;
  }
}
