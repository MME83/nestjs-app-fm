import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  STAGE: Joi.string().required(),
  PORT: Joi.number().port().default(3000).required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  API_KEY: Joi.string().required(),
  INFORM_CLIENT: Joi.number().integer().min(0).max(1).required(),
  WEBHOOK_URI: Joi.string().uri().optional(),
});
