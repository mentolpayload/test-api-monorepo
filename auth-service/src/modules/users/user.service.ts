import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public async createUser(data: UserDto) {
    return this.userRepository.save(this.userRepository.create(data));
  }

  public async updateHashRT(userId: number, hash: Buffer) {
    return this.userRepository.update(userId, { hashedRt: hash });
  }

  async findByLoginId(loginId: string) {
    return this.userRepository.findOneBy({ loginId });
  }
}
