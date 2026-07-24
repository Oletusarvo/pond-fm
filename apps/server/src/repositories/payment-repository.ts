import { Knex } from 'knex';
import { DBContext } from '../types/db-context';
import { db } from '../db-config';
import { Repository } from './repository';
import { tablenames } from '../tablenames';

export class PaymentRepository extends Repository<{ status: string; type: string; data: string }> {
  constructor() {
    super(
      {
        data: tablenames.payments,
        type: tablenames.paymentTypes,
        status: tablenames.paymentStatuses,
      },
      (ctx: DBContext) => {
        return ctx({ payment: this.tablename.data })
          .join(
            { payment_status: this.tablename.status },
            'payment_status.id',
            'payment.payment_status.id',
          )
          .join({ payment_type: this.tablename.type }, 'payment_type.id', 'payment.payment_type_id')
          .select(
            'payment.id',
            'payment.user_id',
            'payment.currency',
            'payment.amount_in_subunits',
            'payment.recipient_id',
            'payment.created_at',
            'payment_status.label as status',
            'payment_type.label as type',
          );
      },
    );
  }
  findById(paymentId: string, ctx: DBContext) {
    return this.baseQuery(ctx).where({ 'payment.id': paymentId }).first();
  }
  createDonation(
    payload: {
      currency: string;
      userId?: string;
      amountInCents: number;
    },
    ctx: DBContext,
  ) {
    return ctx(this.tablename.data).insert({
      currency: payload.currency,
      amount_in_subunits: payload.amountInCents,
      user_id: payload.userId,
      payment_status_id: db
        .select('id')
        .from(this.tablename.status)
        .where({ label: 'processing' })
        .limit(1),
      payment_type_id: db
        .select('id')
        .from(this.tablename.type)
        .where({ label: 'donation' })
        .limit(1),
    });
  }
  createTip(
    payload: {
      currency: string;
      userId?: string;
      recipientId: string;
      amountInCents: number;
    },
    ctx: DBContext,
  ) {
    return ctx(this.tablename.data).insert({
      currency: payload.currency,
      amount_in_subunits: payload.amountInCents,
      user_id: payload.userId,
      recipient_id: payload.recipientId,
      payment_status_id: db
        .select('id')
        .from(this.tablename.status)
        .where({ label: 'processing' })
        .limit(1),
      payment_type_id: db.select('id').from(this.tablename.type).where({ label: 'tip' }).limit(1),
    });
  }

  async calculateBudget(ctx: DBContext) {
    return ctx
      .select(
        db.raw(
          `(
              SELECT SUM(amount_in_subunits) 
              FROM ?? pd 
              WHERE pd.payment_status_id = (SELECT "id" FROM ?? WHERE "label" = 'processing' LIMIT 1) 
              AND pd.payment_type_id = (SELECT "id" FROM ?? WHERE label = 'donation' LIMIT 1)) AS donations`,
          [this.tablename.data, this.tablename.status, this.tablename.type],
        ),
        db.raw(
          `(
              SELECT ROUND(SUM(amount_in_subunits) * 0.05)
              FROM ?? pd 
              WHERE pd.payment_status_id = (SELECT "id" FROM ?? WHERE "label" = 'processing' LIMIT 1) 
              AND pd.payment_type_id = (SELECT "id" FROM ?? WHERE label = 'tip' LIMIT 1)) AS tips`,
          [this.tablename.data, this.tablename.status, this.tablename.type],
        ),
      )
      .first();
  }
}
