import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { RegisterDto } from "./dtos/register.dto";
import { UserEntity } from "./entities/user.entity";

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
        return await this.userRepository.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
    }

    async findOneById(
        id: string
    ): Promise<UserEntity> {
        return await this.userRepository.findOne({where: {id}});
    }
}
