import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID(4)
    @IsNotEmpty()
    id: string

    @CreateDateColumn({ type: 'timestamp', select: false })
    @IsOptional()
    public created_at?: Date;

    @UpdateDateColumn({ type: 'timestamp', select: false })
    @IsOptional()
    public updated_at?: Date;
}