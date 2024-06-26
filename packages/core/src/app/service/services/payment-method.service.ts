import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PaymentMethodEntity } from '@/app/persistance';

@Injectable()
export class PaymentMethodService {
  constructor(@InjectDataSource() private db: DataSource) {}

  async find() {
    return await this.db.getRepository(PaymentMethodEntity).find();
  }
}
