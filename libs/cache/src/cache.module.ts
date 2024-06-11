import { DynamicModule, Module } from '@nestjs/common';
import {
  CACHE_MANAGER,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { Cache, Store } from 'cache-manager';
import { Env } from '@app/env';
import * as Redis from 'redis';

export const CACHE_SERVICE = 'CACHE_SERVICE';

@Module({})
export class CacheModule {
  static register(ttl: number): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        NestCacheModule.registerAsync({
          inject: [Env],
          useFactory: (env: Env) => ({
            store: redisStore,
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            username: env.REDIS_USERNAME,
            password: env.REDIS_PASSWORD,
            no_ready_check: true,
            ttl,
          }),
        }),
      ],
      providers: [
        {
          provide: CACHE_SERVICE,
          inject: [CACHE_MANAGER],
          useFactory: (cacheManager: Cache) => cacheManager,
        },
      ],
      exports: [CACHE_SERVICE],
    };
  }
}

export interface RedisCache extends Cache {
  store: RedisStore;
}

export interface RedisStore extends Store {
  name: 'redis';
  getClient: () => Redis.RedisClientType;
  isCacheableValue: (value: any) => boolean;
}
