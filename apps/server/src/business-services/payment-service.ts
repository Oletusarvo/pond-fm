import { PaymentRepository } from '../repositories/payment-repository';
import { DBContext } from '../types/db-context';
import { serviceError } from '../utils/service-error';
import { ServiceResponse, ServiceSuccessResponse } from '../types/service-response';

export class PaymentService {
  constructor(private repo: PaymentRepository) {}
  async tipUser(
    payload: {
      currency: string;
      recipientId: string;
      userId?: string;
      amountInCents: number;
    },
    ctx: DBContext,
  ): Promise<ServiceResponse> {
    if (payload.userId === payload.recipientId) {
      return {
        success: false,
        error: serviceError.payment.selfTip,
      };
    }
    await this.repo.createTip(payload, ctx);
    return {
      success: true,
      data: null,
    };
  }

  async donate(
    payload: {
      currency: string;
      userId?: string;
      amountInCents: number;
    },
    ctx: DBContext,
  ) {
    await this.repo.createDonation(payload, ctx);
    return { success: true } as ServiceSuccessResponse;
  }

  async getBudget(ctx: DBContext) {
    const budget = await this.repo.calculateBudget(ctx);
    return {
      success: true,
      data: budget,
    } as ServiceSuccessResponse;
  }
}
