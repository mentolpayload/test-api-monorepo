import { NestFactory } from '@nestjs/core';
import type { INestMicroservice } from '@nestjs/common';
// import { Logger } from '@nestjs/common';
import { AppModule } from 'src/app.module';
// import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap(): Promise<INestMicroservice> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8888,
      },
    },
  );

  await app.listen();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
void bootstrap();
