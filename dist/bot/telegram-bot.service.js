"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const users_service_1 = require("../users/users.service");
const complaints_service_1 = require("../complaints/complaints.service");
const complaint_entity_1 = require("../complaints/entities/complaint.entity");
let TelegramBotService = class TelegramBotService {
    configService;
    usersService;
    complaintsService;
    bot;
    constructor(configService, usersService, complaintsService) {
        this.configService = configService;
        this.usersService = usersService;
        this.complaintsService = complaintsService;
    }
    onModuleInit() {
        this.launch();
    }
    launch() {
        const token = this.configService.get('BOT_TOKEN');
        if (!token) {
            throw new Error('BOT_TOKEN is not defined in the environment variables');
        }
        this.bot = new node_telegram_bot_api_1.default(token, { polling: true });
        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            const keyboard = {
                reply_markup: {
                    keyboard: [
                        [{
                                text: '📱 Kontaktni yuborish',
                                request_contact: true
                            }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            };
            await this.bot.sendMessage(chatId, 'Assalomu alaykum! Iltimos, kontakt ma\'lumotlaringizni yuboring.', keyboard);
        });
        this.bot.on('contact', async (msg) => {
            const chatId = msg.chat.id;
            const contact = msg.contact;
            if (contact) {
                const userId = contact.user_id ? contact.user_id.toString() : chatId.toString();
                const firstName = (contact.first_name || '').trim() ||
                    (contact.last_name || '').trim() || 'User';
                const phoneNumber = contact.phone_number || '';
                try {
                    await this.usersService.findOrCreate(parseInt(userId, 10), firstName, contact.phone_number || '');
                    const keyboard = {
                        reply_markup: {
                            keyboard: [
                                [{ text: '📺 Televizor' }],
                                [{ text: '📱 Telefon' }],
                                [{ text: '🧊 Xolodilnik' }]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    };
                    await this.bot.sendMessage(chatId, 'Qaysi mahsulotni tuzatish kerak?', keyboard);
                }
                catch (error) {
                    console.error('Error saving user:', error);
                    await this.bot.sendMessage(chatId, 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
                }
            }
        });
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;
            if (text && ['📺 Televizor', '📱 Telefon', '🧊 Xolodilnik'].includes(text)) {
                let productType = null;
                switch (text) {
                    case '📺 Televizor':
                        productType = complaint_entity_1.ProductType.TV;
                        break;
                    case '📱 Telefon':
                        productType = complaint_entity_1.ProductType.PHONE;
                        break;
                    case '🧊 Xolodilnik':
                        productType = complaint_entity_1.ProductType.REFRIGERATOR;
                        break;
                }
                if (productType !== null) {
                    await this.complaintsService.create(chatId, productType);
                    await this.bot.sendMessage(chatId, '✅ Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz!', { reply_markup: { remove_keyboard: true } });
                }
            }
        });
    }
};
exports.TelegramBotService = TelegramBotService;
exports.TelegramBotService = TelegramBotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        complaints_service_1.ComplaintsService])
], TelegramBotService);
//# sourceMappingURL=telegram-bot.service.js.map