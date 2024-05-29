import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    id: string

    @CreateDateColumn({ type: 'timestamp', select: false })
    @IsOptional()
    @Field(() => Date, { nullable: true })
    public created_at?: Date;

    @UpdateDateColumn({ type: 'timestamp', select: false })
    @IsOptional()
    @Field(() => Date, { nullable: true })
    public updated_at?: Date;
}