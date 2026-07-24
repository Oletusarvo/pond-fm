import { paymentService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

export const getBudgetHandler = createHandler(async (req, res) => {
  const budget = await paymentService.getBudget(db);
  return res.json(budget.data);
});
