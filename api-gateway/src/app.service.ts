import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('RANDOM_PHRASE_SERVICE')
    private readonly randomService: ClientProxy,
  ) {}

  public async signUp(payload) {
    const pattern = { cmd: 'sign-up' };
    return this.authService.send<string>(pattern, payload);
  }

  public async signIn(payload) {
    const pattern = { cmd: 'sign-in' };
    return this.authService.send<string>(pattern, payload);
  }

  public async logout(payload) {
    const pattern = { cmd: 'logout' };
    return this.authService.send<string>(pattern, payload);
  }

  public async refreshToken(payload) {
    const pattern = { cmd: 'refresh-token' };
    return this.authService.send<string>(pattern, payload);
  }

  public async getUserInfo(payload) {
    const pattern = { cmd: 'info' };
    return this.authService.send<string>(pattern, payload);
  }

  public async getRandomPhrase() {
    const pattern = { cmd: 'phrase' };
    return this.randomService.send<string>(pattern, {});
  }
}
