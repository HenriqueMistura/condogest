import { Router } from 'express';
import * as controller from '../controllers/receitas.controller.js';

const router = Router();

router.get('/', controller.list);
router.post('/gerar-lote', controller.gerarLote);
router.get('/:id', controller.get);
router.post('/', controller.create);

export default router;
