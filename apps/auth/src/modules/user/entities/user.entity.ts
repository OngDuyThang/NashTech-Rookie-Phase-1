import { AbstractEntity } from "@app/database";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Column, Entity } from "typeorm";

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
    password: string;

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

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    @IsOptional()
    enableTwoFactor?: boolean

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    twoFactorSecret?: string

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    apiKey?: string
}