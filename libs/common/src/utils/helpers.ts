import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as url from 'node:url';
import { NODE_ENV } from '../enums/node-env';
import { ParsedUrlQueryInput } from 'node:querystring';
import { ERROR_MESSAGE } from '../enums/messages';
import { join } from 'path';

export const getEnvFilePath = (serviceName: string) =>
  `./apps/${serviceName}/.env.${process.env.NODE_ENV}`;
export const getGqlSchemaPath = (serviceName: string) =>
  `apps/${serviceName}/src/schema.gql`;

export const classValidate = <T = unknown>(
  validationClass: ClassConstructor<T>,
  config: Record<string, unknown>,
  isEnv = false,
): T => {
  const object = plainToInstance(validationClass, config, {
    enableImplicitConversion: true,
  }) as object;

  const errors = validateSync(object, {
    skipMissingProperties: false,
    ...(isEnv
      ? null
      : {
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
  });

  if (errors.length) {
    if (isEnv) {
      throw new Error(errors.map((error) => error.toString()).join('\n'));
    }

    const details = [];
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      details.push(...Object.values(error.constraints));
    }
    throw new BadRequestException(details);
  }

  return object as T;
};

export const classValidateWithoutThrow = <T = unknown>(
  validationClass: ClassConstructor<T>,
  config: Record<string, unknown>,
): T | null => {
  const object = plainToInstance(validationClass, config, {
    enableImplicitConversion: true,
  }) as object;

  const errors = validateSync(object, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length) {
    return null;
  }

  return object as T;
};

export const getUrlEndpoint = (
  hostname: string,
  port: string | number,
  pathname: string,
  query?: ParsedUrlQueryInput,
): string => {
  return url.format({
    protocol: process.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? 'http' : 'https',
    hostname,
    port,
    pathname,
    query,
  });
};

export const getSuccessMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 204:
      return 'No Content';
    case 202:
      return 'Accepted';
  }
};

export const convertRpcException = (e: any) => {
  if (e?.response && e?.status) {
    const response = e.response;
    if (!Object.keys(response).length) {
      return new HttpException(e.message, e.status);
    }
    return new HttpException(response, e.status);
  }

  return new InternalServerErrorException(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
};
