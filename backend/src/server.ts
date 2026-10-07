import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import unidadesRoutes from './routes/unidades.routes.js';
import moradoresRoutes from './routes/moradores.routes.js';
import receitasRoutes from './routes/receitas.routes.js';
import despesasRoutes from './routes/despesas.routes.js';
import webhooksRoutes from './routes/webhooks.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { startCronJobs } from './jobs/index.js';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rotas públicas (não precisam de token)
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhooksRoutes);

// Rotas privadas (protegidas pelo middleware)
app.use('/api/unidades', authMiddleware, unidadesRoutes);
app.use('/api/moradores', authMiddleware, moradoresRoutes);
app.use('/api/receitas', authMiddleware, receitasRoutes);
app.use('/api/despesas', authMiddleware, despesasRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Middleware de erros genéricos
app.use(errorHandler);

// Inicia os jobs em background (cron)
startCronJobs();

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
