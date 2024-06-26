import { Query, Resolver } from '@nestjs/graphql';

import { PaymentMethodService } from '@/app/service';

@Resolver('PaymentMethod')
export class PaymentMethodResolver {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Query('availablePaymentMethods')
  async availablePaymentMethods() {
    const paymentMethods = await this.paymentMethodService.find();

    return paymentMethods;
  }
}
