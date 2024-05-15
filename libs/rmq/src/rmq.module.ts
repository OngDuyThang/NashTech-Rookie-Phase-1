import { DynamicModule, Global, Module } from "@nestjs/common";
import { RmqService } from "./rmq.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { RmqClientOption } from "@app/common";

@Global()
@Module({
  providers: [RmqService],
  exports: [RmqService]
})
export class RmqModule {
  static register(
    clients: RmqClientOption[],
    isGlobal = true
  ): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync({
          clients: clients.map(client => {
            const { provide, queueName } = client
            return {
              name: provide,
              inject: [ConfigService],
              useFactory: (config: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                  urls: [config.get<string>('RABBIT_MQ_URI')],
                  queue: config.get<string>(queueName)
                }
              })
            }
          }),
          isGlobal
        })
      ],
      exports: [ClientsModule]
    }
  }
}