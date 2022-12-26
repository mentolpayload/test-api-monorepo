import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from './configs';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid('development', 'production')
          .default('development')
          .required(),
        APP_MODE: Joi.string()
          .valid('simple', 'secure')
          .default('simple')
          .required(),
        APP_TZ: Joi.any().default('Russia/Moscow').required(),

        APP_HOST: [
          Joi.string().ip({ version: 'ipv4' }).required(),
          Joi.valid('localhost').required(),
        ],
        APP_PORT: Joi.number().default(3001).required(),
        DATABASE_HOST: Joi.any().default('localhost:3309').required(),
        DATABASE_NAME: Joi.any().default('auth').required(),
        DATABASE_USER: Joi.any().optional(),
        DATABASE_PASSWORD: Joi.any().optional(),
        DATABASE_DEBUG: Joi.boolean().default(false).required(),
        DATABASE_OPTIONS: Joi.any().optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
