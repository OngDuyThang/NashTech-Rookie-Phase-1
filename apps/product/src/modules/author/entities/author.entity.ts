import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../common/entities/product.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity({ name: 'author' })
@ObjectType()
export class AuthorEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    pen_name: string;

    @OneToMany(() => ProductEntity, product => product.author)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    @Field(() => [ProductEntity])
    products?: ProductEntity[]
}