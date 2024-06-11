import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
