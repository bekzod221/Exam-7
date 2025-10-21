import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':telegramId')
  async findOne(@Param('telegramId') telegramId: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(telegramId, 10));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
