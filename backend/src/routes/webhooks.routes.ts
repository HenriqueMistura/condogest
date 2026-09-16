import { Router } from 'express';
import * as controller from '../controllers/webhooks.controller.js';
import { webhookAuth } from '../middlewares/webhookAuth.js';

const router = Router();

router.post('/pagamento', webhookAuth, controller.pagamento);

export default router;
