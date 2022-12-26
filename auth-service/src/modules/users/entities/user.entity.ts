import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { LoginType } from '../types/login-type.enum';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ unique: true, nullable: false })
  loginId?: string;

  @Column({
    type: 'enum',
    enum: LoginType,
    nullable: false,
  })
  loginIdType: LoginType;

  @Column({ type: 'bytea', nullable: false })
  password: Buffer;

  @Column({ type: 'bytea', nullable: true })
  hashedRt?: Buffer;
}
