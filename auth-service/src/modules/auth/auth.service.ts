import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import jwt_decode from 'jwt-decode';
import { UserEntity } from '../users/entities/user.entity';
import { Tokens } from './types';
import { UserService } from '../users/user.service';
import { encryptData, validateData } from '../../common/crypto.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto, UserLoginDto } from '../users/dto/user.dto';
import { LoginType } from '../users/types/login-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async phoneOrEmailHelper(input: string) {
    const reEmail = /\S+@\S+\.\S+/;
    if (reEmail.test(input.toLowerCase())) {
      return LoginType.EMAIL;
    } else {
      return LoginType.PHONE;
    }
  }

  public async getUserInfo(loginId: string) {
    const findUser = await this.userService.findByLoginId(loginId);

    if (!findUser) {
      return 'User not found';
    }

    return {
      loginId: findUser.loginId,
      loginIdType: findUser.loginIdType,
    };
  }

  async signUp({ loginId, password }: UserLoginDto) {
    const findUser = await this.userService.findByLoginId(loginId);

    if (findUser) {
      return 'User already signed up';
    }

    const encryptedPassword = await encryptData(password);
    const loginType = await this.phoneOrEmailHelper(loginId);

    const payload: UserDto = {
      loginId,
      password: encryptedPassword,
      loginIdType: loginType,
    };

    const newUser = await this.userService.createUser(payload);

    return this.buildUserResponse(newUser);
  }

  async signIn({ loginId, password }: UserLoginDto): Promise<any> {
    const user = await this.userService.findByLoginId(loginId);

    if (!user) {
      return 'Invalid credentials';
    }

    const isVerifyPassword = await validateData(password, user.password);

    if (!isVerifyPassword) {
      return 'Invalid credentials';
    }

    return this.buildUserResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const tokenParse = refreshToken.split(' ');
    const { userId }: { userId: number } = jwt_decode(refreshToken);

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await validateData(
      tokenParse[1],
      user.hashedRt,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    return this.buildUserResponse(user);
  }

  async logout(userId: number) {
    await this.userService.updateHashRT(userId, null);
  }

  async buildUserResponse(user: UserEntity): Promise<any> {
    const tokens = await this.generateJWT(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await encryptData(refreshToken);
    await this.userService.updateHashRT(userId, hash);
  }

  async generateJWT(user: UserEntity): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: user.id,
          app: 'auth-service',
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: 60 * 10,
        },
      ),
      this.jwtService.signAsync(
        {
          userId: user.id,
          app: 'auth-service',
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: 60 * 10,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
