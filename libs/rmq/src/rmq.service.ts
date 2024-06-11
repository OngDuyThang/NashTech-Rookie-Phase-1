import { QUEUE_NAME } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MicroserviceOptions,
  RmqContext,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getMicroserviceOptions(
    queueName: QUEUE_NAME,
    noAck = true,
  ): MicroserviceOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(queueName),
        noAck,
        persistent: true,
      },
    };
  }

  sendAck(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);
  }
}
