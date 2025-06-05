import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Public } from './public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register({
      ...createUserDto,
      role: UserRole.USER,
    });
    
    const { password, ...result } = user;
    return result;
  }
}