import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from '../users/users.service';
import { ComplaintsService } from '../complaints/complaints.service';
import { ProductType } from '../complaints/entities/complaint.entity';

type KeyboardButton = {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
  request_poll?: any;
  web_app?: any;
};

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly complaintsService: ComplaintsService,
  ) {}

  onModuleInit() {
    this.launch();
  }

  launch() {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('BOT_TOKEN is not defined in the environment variables');
    }

    this.bot = new TelegramBot(token, { polling: true }) as unknown as TelegramBot;

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      
      const keyboard: TelegramBot.SendMessageOptions = {
        reply_markup: {
          keyboard: [
            [{
              text: '📱 Kontaktni yuborish',
              request_contact: true
            } as KeyboardButton]
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
          await this.usersService.findOrCreate(
            parseInt(userId, 10),
            firstName,
            contact.phone_number || ''
          );

        const keyboard: TelegramBot.SendMessageOptions = {
          reply_markup: {
            keyboard: [
              [{ text: '📺 Televizor' } as KeyboardButton],
              [{ text: '📱 Telefon' } as KeyboardButton],
              [{ text: '🧊 Xolodilnik' } as KeyboardButton]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        };
        
          await this.bot.sendMessage(chatId, 'Qaysi mahsulotni tuzatish kerak?', keyboard);
        } catch (error) {
          console.error('Error saving user:', error);
          await this.bot.sendMessage(chatId, 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
        }
      }
    });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      
      if (text && ['📺 Televizor', '📱 Telefon', '🧊 Xolodilnik'].includes(text)) {
        let productType: ProductType | null = null;
        
        switch (text) {
          case '📺 Televizor':
            productType = ProductType.TV;
            break;
          case '📱 Telefon':
            productType = ProductType.PHONE;
            break;
          case '🧊 Xolodilnik':
            productType = ProductType.REFRIGERATOR;
            break;
        }
        
        if (productType !== null) {
          await this.complaintsService.create(chatId, productType);
          await this.bot.sendMessage(
            chatId, 
            '✅ Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz!',
            { reply_markup: { remove_keyboard: true } }
          );
        }
      }
    });
  }
}
