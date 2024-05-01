import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Column, Entity } from "typeorm";

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    username: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    password: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    first_name: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    last_name: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    phone: string;
}