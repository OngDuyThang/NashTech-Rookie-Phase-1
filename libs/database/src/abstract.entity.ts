import { IsUUID } from "class-validator";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID(4)
    id: string
}