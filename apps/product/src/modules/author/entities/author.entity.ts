import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../entities/product.entity";

@Entity({ name: 'author' })
export class AuthorEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    pen_name: string;

    @OneToMany(() => ProductEntity, product => product.author)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    products?: ProductEntity[]
}