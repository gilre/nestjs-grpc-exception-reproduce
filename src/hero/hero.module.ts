import { Module } from '@nestjs/common';
import { ClientGrpcProxy, RpcException } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { HeroController } from './hero.controller';

class ErrorHandlingProxy extends ClientGrpcProxy {
  serializeError(err) {
    return new RpcException(err);
  }
}

@Module({
  providers: [
    {
      provide: 'HERO_PACKAGE',
      useFactory() {
        return new ErrorHandlingProxy(grpcClientOptions.options);
      },
    },
  ],
  controllers: [HeroController],
})
export class HeroModule {}
