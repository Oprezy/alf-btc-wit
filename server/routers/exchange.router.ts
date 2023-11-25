import { Router } from "express";
import { exchangeController } from "../controllers/exchange.controller";
const exchangeRouter = Router();

exchangeRouter.get('/', exchangeController.getAllExchanges);
exchangeRouter.get('/', );
exchangeRouter.post('/', exchangeController.createExchange);

export default exchangeRouter;