import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { DataSource } from 'typeorm';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { txnController } from './controllers/txns.controller';
import { Txn } from './entities/txns.entity';
import { User } from './entities/user.entity';
import { Hash } from './entities/hash.entity';
import { Address } from './entities/address.entity';
import { Exchange } from './entities/exchange.entity';
import addressRouter from './routers/address.router';
import exchangeRouter from './routers/exchange.router';
import txnsRouter from './routers/txns.router';
import userRouter from './routers/user.router';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/address', addressRouter);
app.use('/exchange', exchangeRouter);
app.use('/txn', txnsRouter);
app.use('/user', userRouter);

app.use(express.static(path.join(__dirname, '../client/dist')));

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'prez',
    password: 'password',
    database: 'btc_scraper',
    entities: [Address, Hash, Txn, User, Exchange],
    synchronize: true, 
})

app.get('/', (req: Request, res: Response) => {
    res.send("Yoooo")
})

// Handle SPA for Vue.js routing
app.get(/.*/, (req: Request, res: Response) => res.sendFile(path.join(__dirname, '../client/dist', 'index.html')));

cron.schedule('*/5 * * * *', () => {
    txnController.runAllJobs();
})

AppDataSource.initialize().then(() => {
    const PORT = 2011
    app.listen(PORT, () => console.log("app running on port " + PORT));
});

   