import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { Transport } from '@nestjs/microservices';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { name } from 'package.json';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 8888,
    },
  });

  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env');
  const tz: string = configService.get<string>('app.timezone');
  const versioning: boolean = configService.get<boolean>('app.versioning.on');

  const logger = new Logger();
  process.env.TZ = tz;
  process.env.NODE_ENV = env;

  // Global
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Listen
  app.listen().then(() => {
    logger.log(`==========================================================`);
    logger.log(`App Environment is ${env}`, 'NestApplication');
    logger.log(
      `App Language is ${configService.get<string>('app.language')}`,
      'NestApplication',
    );
    logger.log(
      `App Debug is ${configService.get<boolean>('app.debug')}`,
      'NestApplication',
    );
    logger.log(`App Versioning is ${versioning}`, 'NestApplication');
    logger.log(
      `App Http is ${configService.get<boolean>('app.httpOn')}`,
      'NestApplication',
    );
    logger.log(
      `App Task is ${configService.get<boolean>('app.jobOn')}`,
      'NestApplication',
    );
    logger.log(`App Timezone is ${tz}`, 'NestApplication');
    logger.log(
      `Database Debug is ${configService.get<boolean>('database.debug')}`,
      'NestApplication',
    );

    logger.log(`==========================================================`);

    logger.log(
      `Database running on ${configService.get<string>(
        'database.host',
      )}/${configService.get<string>('database.name')}`,
      'NestApplication',
    );
    logger.log(`Microservice ${name} is up and running`);

    logger.log(`==========================================================`);
  });

  return app;
}

void bootstrap();
