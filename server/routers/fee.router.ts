import { Router } from "express";
import { feeController } from "../controllers/fee.controller";

const feeRouter = Router();

feeRouter.get('/', feeController.getFees);
feeRouter.get('/all-fees', feeController.fetchFees);

export default feeRouter;