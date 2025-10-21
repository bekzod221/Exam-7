import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ComplaintsService } from '../complaints/complaints.service';
export declare class TelegramBotService implements OnModuleInit {
    private readonly configService;
    private readonly usersService;
    private readonly complaintsService;
    private bot;
    constructor(configService: ConfigService, usersService: UsersService, complaintsService: ComplaintsService);
    onModuleInit(): void;
    launch(): void;
}
