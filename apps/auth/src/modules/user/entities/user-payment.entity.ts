import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { PAYMENT_TYPE } from "../../../common/enums";

@Entity({ name: 'user_payment' })
export class UserPaymentEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, user => user.payments)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    user_id: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    payment_id: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    payment_type: PAYMENT_TYPE

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    provider: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    @IsString()
    @IsNotEmpty()
    account_no: string

    // @Column({type: 'date', nullable: false})
    // expiry: string
}