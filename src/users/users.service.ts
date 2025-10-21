import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(telegramId: number, firstName?: string, phone?: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { telegramId } });

    if (!user) {
      user = this.usersRepository.create({
        telegramId,
        firstName,
        phone,
      });
      await this.usersRepository.save(user);
    } else if ((!user.phone && phone) || !user.firstName) {
      // Update user data if phone or name is missing
      user.phone = phone || user.phone;
      user.firstName = firstName || user.firstName;
      await this.usersRepository.save(user);
    }

    return user;
  }

  async findOne(telegramId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { telegramId } });
  }
}
