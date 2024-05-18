import { IsNotEmpty, IsNumberString } from "class-validator";

export class PaginationDto {
    @IsNumberString()
    @IsNotEmpty()
    page: number;

    @IsNumberString()
    @IsNotEmpty()
    limit: number
}