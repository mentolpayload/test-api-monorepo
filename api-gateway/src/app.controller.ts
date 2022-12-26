import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Post('signup')
  public async signup(@Req() req: Request) {
    return this.appService.signUp(req.body);
  }

  @Post('signin')
  public async signIn(@Req() req: Request) {
    return this.appService.signIn(req.body);
  }

  @Get('logout/:_id')
  public async logout(@Param('_id') _id: number) {
    return this.appService.logout(_id);
  }

  @Get('info/:_id')
  public async getUserInfo(@Param('_id') _id: number) {
    return this.appService.getUserInfo(_id);
  }

  @Get('phrase')
  public async getRandomPhrase() {
    return this.appService.getRandomPhrase();
  }

  @Get('latency')
  public async latency() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
    ]);
  }
}
