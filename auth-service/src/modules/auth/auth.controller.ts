import { Controller } from '@nestjs/common';
import { UserLoginDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'sign-in' })
  private async signIn(payload: UserLoginDto): Promise<any> {
    return this.authService.signIn(payload);
  }

  @MessagePattern({ cmd: 'sign-up' })
  private async signUp(payload: UserLoginDto): Promise<any> {
    return this.authService.signUp(payload);
  }

  @MessagePattern({ cmd: 'refresh-token' })
  private async refreshToken(data: { refreshToken: string }): Promise<any> {
    return this.authService.refreshToken(data.refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  private async logout(userId: number): Promise<any> {
    return this.authService.logout(userId);
  }

  @MessagePattern({ cmd: 'info' })
  private async getInfo(loginId: string): Promise<any> {
    return this.authService.getUserInfo(loginId);
  }
}
