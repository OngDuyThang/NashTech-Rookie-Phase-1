import { AbstractEntity } from "@app/database";
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { UserAddressEntity } from "./user-address.entity";
import { Type } from "class-transformer";
import { UserPaymentEntity } from "./user-payment.entity";
import { OPENID_PROVIDER } from "../../../common/enums";
import { ROLE } from "@app/common";

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    username: string;

    @Column({ type: 'text', nullable: false })
    @IsString()
    @IsNotEmpty()
    password?: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    first_name: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    last_name?: string;

    @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
    @IsEmail()
    @IsOptional()
    @MaxLength(50)
    email?: string;

    @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    phone?: string;

    @OneToMany(() => UserAddressEntity, userAddress => userAddress.user)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UserAddressEntity)
    addresses?: UserAddressEntity[]

    @OneToMany(() => UserPaymentEntity, userPayment => userPayment.user)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UserPaymentEntity)
    payments?: UserPaymentEntity[]

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    picture?: string

    @Column({ type: 'varchar', length: 20, nullable: true })
    @IsEnum(OPENID_PROVIDER)
    @IsOptional()
    openid_provider?: OPENID_PROVIDER

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    @IsOptional()
    enable_two_factor?: boolean

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    two_factor_secret?: string

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    one_time_token?: string

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    api_key?: string

    @Column({ type: 'varchar', length: 20, nullable: false, default: ROLE.USER })
    @IsEnum(ROLE)
    @IsNotEmpty()
    role: ROLE

    @Column({ type: 'boolean', default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean
}