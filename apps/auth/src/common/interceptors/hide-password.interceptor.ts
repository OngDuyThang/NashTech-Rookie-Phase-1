import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable, map } from "rxjs";

@Injectable()
export class HideSensitiveInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                delete data.password;
                delete data.enableTwoFactor;
                delete data.twoFactorSecret;
                delete data.apiKey;

                return data;
            })
        );
    }
}