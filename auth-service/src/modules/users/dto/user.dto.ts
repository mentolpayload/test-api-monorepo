import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { LoginType } from '../types/login-type.enum';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  public readonly loginId: string;

  @IsNotEmpty()
  public readonly password: Buffer;

  @IsNotEmpty()
  @IsEnum(LoginType)
  public readonly loginIdType: LoginType;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  public readonly loginId: string;

  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}

export class UserResponseDto {
  @IsNotEmpty()
  @IsString()
  public readonly loginId: string;

  @IsNotEmpty()
  @IsEnum(LoginType)
  public readonly loginIdType: LoginType;
}
