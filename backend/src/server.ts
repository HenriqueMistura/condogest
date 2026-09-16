import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import unidadesRoutes from './routes/unidades.routes.js';
import moradoresRoutes from './routes/moradores.routes.js';
import receitasRoutes from './routes/receitas.routes.js';
import despesasRoutes from './routes/despesas.routes.js';
import webhooksRoutes from './routes/webhooks.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { startCronJobs } from './jobs/index.js';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/unidades', unidadesRoutes);
app.use('/api/moradores', moradoresRoutes);
app.use('/api/receitas', receitasRoutes);
app.use('/api/despesas', despesasRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middleware de erros genéricos
app.use(errorHandler);

// Inicia os jobs em background (cron)
startCronJobs();

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
