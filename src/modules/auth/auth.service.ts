// src/modules/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { hashPassword } from 'src/common/utils/hash-password.util';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await hashPassword(createUserDto.password);

      const user = this.userRepository.create({
        ...createUserDto,
        password_hash: passwordHash,
      });

      await this.userRepository.save(user);

      const { password_hash, ...result } = user;

      await this.logsService.createLog(
        user,
        'CREATE',
        'User',
        user.id,
        `User created with ID: ${user.id}`,
      );

      return {
        ...result,
        token: this.getJwtToken({ id: user.id, email: user.email }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password_hash: true },
    });

    if (!user) {
      await this.logsService.createLog(
        null,
        'LOGIN_FAIL',
        'User',
        0,
        `Failed login attempt with email: ${email}`,
      );
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await this.logsService.createLog(
        user,
        'LOGIN_FAIL',
        'User',
        user.id,
        'Failed login attempt due to invalid password',
      );
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    await this.logsService.createLog(
      user,
      'LOGIN',
      'User',
      user.id,
      `User logged in with ID: ${user.id}`,
    );

    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  async checkAuthStatus(user: User) {
    await this.logsService.createLog(
      user,
      'CHECK_AUTH_STATUS',
      'User',
      user.id,
      `Checked auth status for user with ID: ${user.id}`,
    );

    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code == '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
