import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from '../database/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from "dotenv";

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    DatabaseModule.forFeature([]),
    // ConfigModule.forRoot({
    //   envFilePath: `./apps/auth/.env.${process.env.NODE_ENV}`
    // })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
