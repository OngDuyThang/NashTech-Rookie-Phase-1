import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "../../modules/user/dtos/register.dto";

@Injectable()
export class HashPasswordPipe implements PipeTransform {
    async transform(dto: RegisterDto, _metadata: ArgumentMetadata): Promise<RegisterDto> {
        try {
            const { password } = dto
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            return {
                ...dto,
                password: hashedPassword
            }
        } catch (e) {
            throw e;
        }
    }
}