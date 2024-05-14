import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Env {
    constructor(
        private readonly configService: ConfigService
    ) {}

    get NODE_ENV() {
        return this.configService.get<string>('NODE_ENV');
    }

    get SERVICE_HOST_NAME() {
        return this.configService.get<string>('SERVICE_HOST_NAME');
    }

    get SERVICE_PORT() {
        return this.configService.get<string>('SERVICE_PORT');
    }

    get DB_HOST() {
        return this.configService.get<string>('DB_HOST');
    }

    get DB_PORT() {
        return this.configService.get<string>('DB_PORT');
    }

    get DB_USERNAME() {
        return this.configService.get<string>('DB_USERNAME');
    }

    get DB_PASSWORD() {
        return this.configService.get<string>('DB_PASSWORD');
    }

    get DB_NAME() {
        return this.configService.get<string>('DB_NAME');
    }

    get REDIS_HOST() {
        return this.configService.get<string>('REDIS_HOST');
    }

    get REDIS_PORT() {
        return this.configService.get<string>('REDIS_PORT');
    }

    get REDIS_USERNAME() {
        return this.configService.get<string>('REDIS_USERNAME');
    }

    get REDIS_PASSWORD() {
        return this.configService.get<string>('REDIS_PASSWORD');
    }

    get ACCESS_TOKEN_SECRET() {
        return this.configService.get<string>('ACCESS_TOKEN_SECRET');
    }

    get REFRESH_TOKEN_SECRET() {
        return this.configService.get<string>('REFRESH_TOKEN_SECRET');
    }

    get VALIDATE_OTP_PATH_NAME() {
        return this.configService.get<string>('VALIDATE_OTP_PATH_NAME');
    }

    get RESET_PASSWORD_PATH_NAME() {
        return this.configService.get<string>('RESET_PASSWORD_PATH_NAME');
    }

    get MAILER_USERNAME() {
        return this.configService.get<string>('MAILER_USERNAME');
    }

    get MAILER_PASSWORD() {
        return this.configService.get<string>('MAILER_PASSWORD');
    }

    get GOOGLE_CLIENT_ID() {
        return this.configService.get<string>('GOOGLE_CLIENT_ID');
    }

    get GOOGLE_CLIENT_SECRET() {
        return this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    }

    get GOOGLE_CALLBACK_URL() {
        return this.configService.get<string>('GOOGLE_CALLBACK_URL');
    }

    get GOOGLE_ISSUER() {
        return this.configService.get<string>('GOOGLE_ISSUER');
    }

}
