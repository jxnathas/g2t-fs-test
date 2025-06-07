
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
  const ability = this.caslAbilityFactory.createForUser(user);
  
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    abilities: ability.rules,
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto, undefined);
  }
}