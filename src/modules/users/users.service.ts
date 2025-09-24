import { BadRequestException, ConsoleLogger, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/dto/auth.dto';
import { SecurityConfig } from '../../core/config/security';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, 
    private readonly configService: ConfigService) {}

  async create(dto: UserCreateDto) {
    const {saltRounds} = this.configService.get<SecurityConfig>('security');

    try {
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
      const user = this.userRepository.create({ ...dto, password: hashedPassword });

      await this.userRepository.save(user);
      return this.findById(user.id);
    } catch (error) {
      if (error?.code?.toString() === '23505') {
        throw new BadRequestException('User already exists');
      }

      throw new InternalServerErrorException('Failed to create user');
    } 
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
