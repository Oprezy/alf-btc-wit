import { Router } from "express";
import { addressController } from "../controllers/address.controller";

const addressRouter = Router();

addressRouter.get('/', addressController.getAllAddresses);
addressRouter.get('/balance', addressController.getAddressBalance);
// addressRouter.post('/', addressController.createAddress );

addressRouter.get('/test', addressController.saveAllAddresses);

export default addressRouter;