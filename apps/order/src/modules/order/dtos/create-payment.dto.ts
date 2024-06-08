import { Type } from "class-transformer";
import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import { PaymentCardDto } from "./payment-card.dto";

export class CreatePaymentDto {
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PaymentCardDto)
    card: PaymentCardDto;

    @IsNumber()
    amount: number;
}