import { OnModuleInit } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
export declare class BotModule implements OnModuleInit {
    private readonly telegramBotService;
    constructor(telegramBotService: TelegramBotService);
    onModuleInit(): void;
}
