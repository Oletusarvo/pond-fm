import { getRouter } from '../../../utils/get-router';
import { getBudgetHandler } from './handlers/get-budget-handler';

const router = getRouter();

router.get('/', getBudgetHandler);

export { router as budgetRouter };
