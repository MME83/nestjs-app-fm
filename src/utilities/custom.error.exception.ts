import { HttpStatus } from '@nestjs/common';
import { DomainValueType } from '../common/const.domains';
import { Helper } from './helper';

export class CustomErrorException extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: DomainValueType,
    public readonly error: string, // error name
    public readonly message: string, // Internal message
    public readonly statusCode: HttpStatus,
  ) {
    super(message);
    this.id = Helper.genId();
    this.timestamp = new Date();
  }
}
