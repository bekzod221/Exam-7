import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotService } from './bot.service.js';
import { UsersModule } from '../users/users.module';
import { ComplaintsModule } from '../complaints/complaints.module';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ComplaintsModule,
  ],
  providers: [BotService, TelegramBotService],
  exports: [BotService],
})
export class BotModule implements OnModuleInit {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  onModuleInit() {
    this.telegramBotService.launch();
  }
}
