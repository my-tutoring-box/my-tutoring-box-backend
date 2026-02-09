import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { caching } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CACHE_MANAGER',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return caching(redisStore, {
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
          ttl: 259200 * 1000,
        });
      },
    },
  ],
  exports: ['CACHE_MANAGER'],
})
export class RedisCacheModule {}
