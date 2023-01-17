import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Helper } from '../utilities/helper';
import { DomainValueType } from '../common/const.domains';
import { CustomErrorException } from '../utilities/custom.error.exception';

export interface IApiError {
  id: string;
  domain: DomainValueType;
  error: string;
  message: string | object;
  timestamp: Date;
}

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    let body: IApiError;
    let statusCode: HttpStatus;

    if (exception instanceof CustomErrorException) {
      body = {
        domain: exception.domain,
        error: exception.error,
        message: exception.message,
        id: exception.id,
        timestamp: exception.timestamp,
      };
      statusCode = exception.statusCode;
    } else if (exception instanceof HttpException) {
      // extract internal message & status from NestJS errors
      // useful with class-validator
      body = {
        domain: 'generic',
        error: exception.message,
        message: exception.getResponse()['message'] || exception.message,
        id: Helper.genId(),
        timestamp: new Date(),
        //statusCode: exception.getStatus(),
      };
      statusCode = exception.getStatus();
    } else {
      // For all other exception return 500 error
      body = new CustomErrorException(
        'generic',
        'Internal error occurred',
        `Internal error occurred: ${exception.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    //const status = exception.getStatus();

    // Logs will contain error identifier as well as
    // request path where is occurred
    this.logger.error(
      `Got an exception: ${JSON.stringify({
        status: 'failure',
        path: request.url,
        method: request.method,
        ...body,
      })}. Exception: ${JSON.stringify(exception)}`,
    );

    response
      .status(statusCode)
      .json({ status: 'failure', statusCode, ...body });
  }
}
