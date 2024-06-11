import { AbstractEntity } from '@app/database';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'page' })
export class PageEntity extends AbstractEntity {
  @Column({ type: 'text', nullable: true, default: null })
  @IsString()
  @IsOptional()
  content?: string;
}
