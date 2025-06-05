import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser?: User): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    if (createUserDto.role && createUserDto.role !== UserRole.USER) {
      if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only admin can create users with elevated roles');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(currentUser: User): Promise<User[]> {
    if (currentUser.role === UserRole.ADMIN) {
      return this.usersRepository.find();
    }
    
    if (currentUser.role === UserRole.MANAGER) {
      return this.usersRepository.find({
        select: ['id', 'name', 'email', 'role'],
      });
    }

    return [await this.findOne(currentUser.id)];
  }

  async findOne(id: number, currentUser?: User): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id } 
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (currentUser && currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return user;
  }

  async update(
    id: number, 
    updateUserDto: UpdateUserDto, 
    currentUser: User
  ): Promise<User> {
    const user = await this.findOne(id);

    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (updateUserDto.role && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can change user roles');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
      role: updateUserDto.role ? updateUserDto.role as UserRole : user.role,
    });
  }

  async remove(id: number, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete users');
    }

    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
  return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }
}