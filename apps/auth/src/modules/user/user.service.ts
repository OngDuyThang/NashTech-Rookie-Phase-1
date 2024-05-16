import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { RegisterDto } from "./dtos/register.dto";
import { UserEntity } from "./entities/user.entity";
import { ERROR_MESSAGE } from "@app/common";
import { authenticator } from "otplib";
import { TEnableTwoFactorResponse } from "../../common/types";
import { OPENID_PROVIDER } from "../../common/enums";

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
            enable_two_factor: true,
            two_factor_secret: secret
        });
        return {
            twoFactorSecret: secret
        }
    }

    async disableTwoFactor(
        id: string
    ): Promise<void> {
        await this.userRepository.update({ id }, {
            enable_two_factor: false,
            two_factor_secret: null
        });
    }

    async updateOneTimeToken(
        id: string,
        token: string | null
    ): Promise<void> {
        await this.userRepository.update({ id }, {
            one_time_token: token
        });
    }

    async updatePassword(
        id: string,
        password: string
    ): Promise<void> {
        await this.userRepository.update({ id }, {
            password
        });
    }

    async validateExistEmail(
        email: string
    ): Promise<UserEntity | null> {
        try {
            return await this.userRepository.findOne({ where: { email } });
        } catch (e) {
            if (e instanceof NotFoundException) {
                return null;
            }
            throw e;
        }
    }

    async setOpenIDProvider(
        email: string,
        provider: OPENID_PROVIDER
    ): Promise<void> {
        await this.userRepository.update({ email }, {
            openid_provider: provider
        });
    }
}