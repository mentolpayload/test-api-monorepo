import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ExpressRequestInterface } from '../types';
import { ConfigService } from '@nestjs/config';
import { JwtData } from './jwt.strategy';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: ExpressRequestInterface, payload: JwtData) {
    const refreshToken = req.get('authorization').split(' ')[1];

    return {
      ...payload,
      refreshToken,
    };
  }
}
