import { AbstractEntity } from "@app/database";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { OrderItemEntity } from "../../item/entities/item.entity";
import { Trim } from "@app/common";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "../common";

@Entity({ name: 'order' })
@ObjectType()
export class OrderEntity extends AbstractEntity {
    // Many to One
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    user_id: string

    @Column({ type: 'decimal', nullable: false, default: 0 })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Field()
    total?: number

    @OneToMany(() => OrderItemEntity, item => item.order)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => OrderItemEntity)
    @Field(() => [OrderItemEntity], { nullable: true })
    items?: OrderItemEntity[]

    @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Trim()
    @Field(() => String, { nullable: false })
    name: string

    @Column({ type: 'varchar', length: 50, nullable: false, default: '' })
    @IsNumberString()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    @Field(() => String, { nullable: false })
    phone: string

    @Column({ type: 'varchar', length: 50, nullable: false, default: '' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    @Field(() => String, { nullable: false })
    email: string

    @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @Trim()
    @Field(() => String, { nullable: false })
    address: string

    @Column({ type: 'varchar', nullable: false, default: PAYMENT_METHOD.COD })
    @IsEnum(PAYMENT_METHOD)
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: PAYMENT_METHOD.COD })
    payment_method: PAYMENT_METHOD

    @Column({ type: 'varchar', nullable: false, default: PAYMENT_STATUS.PENDING })
    @IsEnum(PAYMENT_STATUS)
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: PAYMENT_STATUS.PENDING })
    payment_status: PAYMENT_STATUS
}