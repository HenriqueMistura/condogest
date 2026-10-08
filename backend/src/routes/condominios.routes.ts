import { Router } from 'express';
import { condominiosController } from '../controllers/condominios.controller.js';

const condominiosRoutes = Router();

condominiosRoutes.get('/', condominiosController.listar);
condominiosRoutes.post('/', condominiosController.criar);
condominiosRoutes.delete('/:id', condominiosController.excluir);

export default condominiosRoutes;
