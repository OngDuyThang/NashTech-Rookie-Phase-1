import { AbstractEntity } from '@app/database';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { Type } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { TempItemEntity } from '../../item/entities/temp-item.entity';

@Entity({ name: 'temp_cart' })
@ObjectType()
export class TempCartEntity extends AbstractEntity {
  @Column({ type: 'uuid', nullable: false })
  @IsUUID(4)
  @IsNotEmpty()
  @Field()
  guest_id: string;

  @Column({ type: 'decimal', nullable: false, default: 0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Field()
  total?: number;

  @OneToMany(() => TempItemEntity, (item) => item.temp_cart)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TempItemEntity)
  @Field(() => [TempItemEntity], { nullable: true })
  items?: TempItemEntity[];
}
