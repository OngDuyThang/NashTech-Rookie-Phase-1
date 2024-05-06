import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { RegisterDto } from "./dtos/register.dto";
import { UserEntity } from "./entities/user.entity";
import { ERROR_MESSAGE } from "@app/common";
import { authenticator } from "otplib";
import { TEnableTwoFactorResponse } from "../../common/types";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async create(
        registerDto: RegisterDto
    ): Promise<UserEntity> {
        return await this.userRepository.create(registerDto);
    }

    async findOne(
        usernameOrEmail: string
    ): Promise<UserEntity> {
        try {
            return await this.userRepository.findOne({
                where: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
            });
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException(ERROR_MESSAGE.USER_NOT_EXIST);
            }
            throw e;
        }
    }

    async findOneById(
        id: string
    ): Promise<UserEntity> {
        try {
            return await this.userRepository.findOne({ where: { id } });
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException(ERROR_MESSAGE.USER_NOT_EXIST);
            }
            throw e;
        }
    }

    async enableTwoFactor(
        id: string
    ): Promise<TEnableTwoFactorResponse> {
        const secret = authenticator.generateSecret()
        await this.userRepository.update({ id }, {
            enableTwoFactor: true,
            twoFactorSecret: secret
        });
        return {
            twoFactorSecret: secret
        }
    }

    async disableTwoFactor(
        id: string
    ): Promise<void> {
        await this.userRepository.update({ id }, {
            enableTwoFactor: false,
            twoFactorSecret: null
        });
    }
}
