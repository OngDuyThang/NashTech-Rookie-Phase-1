import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";
import { Check, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: 'review' })
@Check(`"rating" >= 1 AND "rating" <= 5`)
@ObjectType()
export class ReviewEntity extends AbstractEntity {
    @Column({ type: 'decimal', nullable: false, default: 5 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
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