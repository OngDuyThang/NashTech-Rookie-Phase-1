import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from '../database/data-source';

@Module({
  imports: [
    // DatabaseModule.forRoot(dataSourceOptions),
    DatabaseModule.forFeature([]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
