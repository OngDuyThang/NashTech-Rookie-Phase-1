import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "../../modules/user/dtos/register.dto";
import { ResetPasswordDto } from "../dtos";

@Injectable()
export class HashPasswordPipe implements PipeTransform {
    async transform(dto: any, metadata: ArgumentMetadata): Promise<RegisterDto | ResetPasswordDto> {
        try {
            if (metadata.type != 'body') return

            const salt = await bcrypt.genSalt();
            if (dto?.password) {
                const hashedPassword = await bcrypt.hash(dto?.password, salt);
                return {
                    ...dto,
                    password: hashedPassword
                }
            }

            const hashedPassword = await bcrypt.hash(dto?.newPassword, salt);
            return {
                ...dto,
                newPassword: hashedPassword
            }
        } catch (e) {
            throw e;
        }
    }
}