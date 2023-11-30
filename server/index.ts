import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
const app: Express = express();
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import { Fee } from './entities/fee.entity';
import { feeController } from './controllers/fee.controller';
import feeRouter from './routers/fee.router';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/fee', feeRouter);


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: '',
  password: '',
  database: '',
  entities: [Fee],
  synchronize: true,
});

app.get('/', (req: Request, res: Response) => {
  res.send('Yoooo');
});

// Handle SPA for Vue.js routing
app.get(/.*/, (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html')),
);


cron.schedule('*/10 * * * *', () => {
  feeController.getFees();
});

AppDataSource.initialize().then(() => {
  const PORT = 2011;
  app.listen(PORT, () => console.log('app running on port ' + PORT));
});
