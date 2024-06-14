import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators';
import { User } from './entities/user.entity';
import { Auth } from './decorators';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'Register a new user with provided credentials.',
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'Authenticate user and return JWT token.',
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiOkResponse({
    description: 'Return user info and authentication status.',
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @Auth()
  @ApiOperation({ summary: 'Access private route' })
  @ApiOkResponse({
    description: 'Access a private route with user information.',
  })
  testingPrivateRoute(@GetUser() user: User) {
    return { user };
  }
}
