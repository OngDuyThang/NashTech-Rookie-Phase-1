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

    get ACCESS_TOKEN_SECRET() {
        return this.configService.get<string>('ACCESS_TOKEN_SECRET');
    }

    get REFRESH_TOKEN_SECRET() {
        return this.configService.get<string>('REFRESH_TOKEN_SECRET');
    }

    get VALIDATE_OTP_ENDPONT() {
        return this.configService.get<string>('VALIDATE_OTP_ENDPONT');
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

    get MAILER_USERNAME() {
        return this.configService.get<string>('MAILER_USERNAME');
    }

    get MAILER_PASSWORD() {
        return this.configService.get<string>('MAILER_PASSWORD');
    }
}
