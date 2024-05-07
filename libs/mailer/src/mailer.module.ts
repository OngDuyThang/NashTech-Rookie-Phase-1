import { DynamicModule, Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export const MAILER_SERVICE = 'MAILER_SERVICE'

@Module({})
export class MailerModule {
  static forRoot(
    user: string,
    password: string
  ): DynamicModule {
    return {
      module: MailerModule,
      providers: [{
        provide: MAILER_SERVICE,
        useFactory: (): nodemailer.Transporter => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user,
              pass: password
            }
          });
          return transporter
        }
      }],
      exports: [MAILER_SERVICE]
    }
  }
}
