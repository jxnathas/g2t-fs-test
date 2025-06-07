import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: UserRole.USER,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockImplementation((user) => user as User);
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: 'hashedpassword',
      } as User);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const result = await service.create(createUserDto);
      expect(result.password).toBe('hashedpassword');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        role: UserRole.USER,
      } as User);

      await expect(
        service.create({
          name: 'Test',
          email: 'test@example.com',
          password: 'password',
          role: UserRole.USER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

});