import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint, ProductType } from './entities/complaint.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
  ) {}

  async create(telegramId: number, productType: ProductType): Promise<Complaint> {
    const complaint = this.complaintsRepository.create({
      telegramId,
      productType,
    });
    return this.complaintsRepository.save(complaint);
  }

  async findAllByTelegramId(telegramId: number): Promise<Complaint[]> {
    return this.complaintsRepository.find({ where: { telegramId } });
  }

  async findOne(id: number): Promise<Complaint | null> {
    return this.complaintsRepository.findOne({ where: { id } });
  }
}
