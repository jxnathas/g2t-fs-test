import * as common from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';

@common.Controller('users')
@common.UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @common.Post()
  @Roles(UserRole.ADMIN)
  @common.HttpCode(common.HttpStatus.CREATED)
  create(@common.Body() createUserDto: CreateUserDto, @common.Request() req) {
    return this.usersService.create(createUserDto, req.user);
  }

  @common.Get()
  @common.HttpCode(common.HttpStatus.OK)
  findAll(@common.Request() req) {
    return this.usersService.findAll(req.user);
  }

  @common.Get(':id')
  @common.HttpCode(common.HttpStatus.OK)
  findOne(@common.Param('id') id: string, @common.Request() req) {
    return this.usersService.findOne(+id, req.user);
  }

  @common.Patch(':id')
  @common.HttpCode(common.HttpStatus.OK)
  update(
    @common.Param('id') id: string,
    @common.Body() updateUserDto: UpdateUserDto,
    @common.Request() req,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @common.Delete(':id')
  @Roles(UserRole.ADMIN)
  @common.HttpCode(common.HttpStatus.NO_CONTENT)
  async remove(@common.Param('id') id: string, @common.Request() req) {
    await this.usersService.remove(+id, req.user);
  }
}