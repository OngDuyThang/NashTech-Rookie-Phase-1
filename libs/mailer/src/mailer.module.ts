import { Env } from '@app/env';
import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export const MAILER_SERVICE = 'MAILER_SERVICE';

@Module({
  providers: [
    {
      inject: [Env],
      provide: MAILER_SERVICE,
      useFactory: (env: Env): nodemailer.Transporter => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: env.MAILER_USERNAME,
            pass: env.MAILER_PASSWORD,
          },
        });
        return transporter;
      },
    },
  ],
  exports: [MAILER_SERVICE],
})
export class MailerModule {}
