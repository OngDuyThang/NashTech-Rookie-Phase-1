import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from '@app/database';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [DatabaseModule.forFeature([UserEntity])],
  controllers: [],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
