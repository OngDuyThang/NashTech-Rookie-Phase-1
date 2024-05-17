import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductEntity } from "../../product";

@Entity({ name: 'review' })
@ObjectType()
export class ReviewEntity extends AbstractEntity {
    @Column({ type: 'decimal', nullable: false, default: 5 })
    @IsNumber()
    @IsNotEmpty()
    @Field()
    rating: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    title: string;

    @Column({ type: 'text', nullable: false })
    @IsString()
    @IsNotEmpty()
    @Field()
    description: string;

    // UserEntity
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    user_id: string

    @ManyToOne(() => ProductEntity, product => product.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    @IsOptional()
    @Type(() => ProductEntity)
    product?: ProductEntity;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    product_id: string;
}