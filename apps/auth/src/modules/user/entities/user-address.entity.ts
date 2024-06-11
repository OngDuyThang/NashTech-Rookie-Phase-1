import { AbstractEntity } from '@app/database';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { Type } from 'class-transformer';

@Entity({ name: 'user_address' })
export class UserAddressEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  @IsOptional()
  @Type(() => UserEntity)
  user?: UserEntity;

  @Column({ type: 'uuid', nullable: false })
  @IsUUID(4)
  user_id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  @IsString()
  @IsNotEmpty()
  address_line_1: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsString()
  @IsOptional()
  address_line_2: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  country: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
