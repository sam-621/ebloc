import {
  AuthorizePaymentResult,
  CreatePaymentResult,
  Injector,
  OrderEntity,
  PaymentHandler
} from '@ebloc/core';
import { PaypalService } from './paypal.service';

export class PaypalPaymentHandler implements PaymentHandler {
  name = 'Paypal';
  code = 'paypal';

  private paypalService: PaypalService;

  async init(injector: Injector): Promise<void> {
    this.paypalService = await injector.get(PaypalService);
  }

  async createPayment(
    order: OrderEntity,
    totalAmount: number,
    metadata?: Record<string, any>
  ): Promise<CreatePaymentResult> {
    if (!metadata?.paypalOrderId) {
      return {
        status: 'declined',
        error: 'Paypal order id is required'
      };
    }

    const captureResult = await this.paypalService.capturePayment(metadata.paypalOrderId);

    if (!captureResult.success) {
      return {
        status: 'declined',
        error: 'Failed to capture payment',
        rawError: captureResult.error
      };
    }

    const transactionId = captureResult.invoiceId;

    return {
      status: 'authorized',
      amount: totalAmount,
      transactionId: transactionId
    };
  }

  // No need to implement this method for Paypal
  async authorizePayment(order: OrderEntity): Promise<AuthorizePaymentResult> {
    return { success: true };
  }
}
