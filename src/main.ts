import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './filters/custom.exception.filter';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Finance manager API')
    .setDescription('API recives bank transactions and shows stat')
    .setVersion('v1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

bootstrap();
