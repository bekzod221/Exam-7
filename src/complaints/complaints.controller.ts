import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { Complaint, ProductType } from './entities/complaint.entity';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  async create(
    @Body('telegramId') telegramId: number,
    @Body('productType') productType: ProductType,
  ): Promise<Complaint> {
    return this.complaintsService.create(telegramId, productType);
  }

  @Get('user/:telegramId')
  async findAllByTelegramId(
    @Param('telegramId') telegramId: string,
  ): Promise<Complaint[]> {
    return this.complaintsService.findAllByTelegramId(parseInt(telegramId, 10));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Complaint> {
    const complaint = await this.complaintsService.findOne(parseInt(id, 10));
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }
    return complaint;
  }
}
