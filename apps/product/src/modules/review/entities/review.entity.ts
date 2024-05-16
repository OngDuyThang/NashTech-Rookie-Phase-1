import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../entities/product.entity";

@Entity({ name: 'review' })
export class ReviewEntity extends AbstractEntity {
    @Column({ type: 'decimal', nullable: false, default: 5 })
    @IsNumber()
    @IsNotEmpty()
    rating: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @Column({ type: 'text', nullable: false })
    @IsString()
    @IsNotEmpty()
    description: string;

    // UserEntity
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    user_id: string

    @ManyToOne(() => ProductEntity, product => product.reviews)
    @JoinColumn({ name: 'product_id' })
    @IsOptional()
    @Type(() => ProductEntity)
    product?: ProductEntity;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    product_id: string;
}