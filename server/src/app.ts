import express from 'express';
import apiRoutes from './routes';
import { sequelize } from './config/database';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import './modules';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Не удалось запустить сервер:', message);
    process.exit(1);
  }
}

start();
