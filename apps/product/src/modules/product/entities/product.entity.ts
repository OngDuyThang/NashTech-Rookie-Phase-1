import { AbstractEntity } from '@app/database';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Type } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryEntity } from '../../category/entities/category.entity';
import { AuthorEntity } from '../../author/entities/author.entity';
import { PromotionEntity } from '../../promotion/entities/promotion.entity';
import { ReviewEntity } from '../../review/entities/review.entity';
import { ReviewList } from '../../review/entities/review-list.schema';
@Entity({ name: 'product' })
@ObjectType()
export class ProductEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Field()
  title: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', nullable: false })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Field()
  price: number;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  image?: string;

  @ManyToOne(() => AuthorEntity, (author) => author.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'author_id' })
  @IsOptional()
  @Type(() => AuthorEntity)
  @Field(() => AuthorEntity, { nullable: true })
  author?: AuthorEntity;

  @Column({ type: 'uuid', nullable: true })
  @IsUUID(4)
  @IsOptional()
  @Field({ nullable: true })
  author_id?: string;

  // category id
  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  @IsOptional()
  @Type(() => CategoryEntity)
  @Field(() => CategoryEntity, { nullable: true })
  category?: CategoryEntity;

  @Column({ type: 'uuid', nullable: true })
  @IsUUID(4)
  @IsOptional()
  @Field({ nullable: true })
  category_id?: string;

  @ManyToOne(() => PromotionEntity, (promotion) => promotion.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'promotion_id' })
  @IsOptional()
  @Type(() => PromotionEntity)
  @Field(() => PromotionEntity, { nullable: true })
  promotion?: PromotionEntity;

  @Column({ type: 'uuid', nullable: true })
  @IsUUID(4)
  @IsOptional()
  @Field({ nullable: true })
  promotion_id?: string;

  @OneToMany(() => ReviewEntity, (review) => review.product)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewEntity)
  @Field(() => ReviewList, { nullable: true })
  reviews: ReviewEntity[];

  @Column({ type: 'decimal', nullable: true, default: 0 })
  @IsNumber()
  @IsOptional()
  @Field(() => Number, { nullable: true })
  rating?: number;

  @Column({ type: 'decimal', array: true, default: [0, 0, 0, 0, 0] })
  @IsArray({ each: true })
  @IsNumber()
  @IsOptional()
  @Field(() => [Number], { nullable: true })
  ratings?: number[];

  @Column({ type: 'boolean', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
  // inventory id
}
