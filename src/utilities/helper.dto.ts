import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { DomainValueType } from '../common/const.domains';

export class ResponseSuccess<T> {
  @ApiProperty()
  status: 'success';
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  data: T;
}

export class SwaggerApiError {
  status: 'failure';
  statusCode: number;
  @ApiProperty({
    description: 'domain/entity constants',
    enum: ['banks', 'categories', 'transactions', 'reports', 'generic'],
  })
  domain: DomainValueType;
  error: string;
  message: string | object;
  id: string;
  timestamp: Date;
}

// custom decorator for Swagger, generic describe
export const ApiSwaggerResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ResponseSuccess, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseSuccess) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSwaggerResponseArr = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseSuccess, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseSuccess) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          },
        ],
      },
    }),
  );
};
