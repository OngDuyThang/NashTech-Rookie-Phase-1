import { STATUS } from "@app/common";
import { IsEnum, IsNotEmpty } from "class-validator";

export class ChangeStatusDto {
    @IsEnum(STATUS)
    @IsNotEmpty()
    status: STATUS
}