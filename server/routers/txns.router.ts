import { Router } from "express";
import { txnController } from "../controllers/txns.controller";
import { authenticate } from "../utils/authMiddleware";

const txnsRouter = Router();

// txnsRouter.get('/', txnController.getAllTxns );
// txnsRouter.post('/address', txnController.getTxnsByAddress);

// // FRONTEND ROUTES 

txnsRouter.post('/get-txn', authenticate.checkAdmin, txnController.getTxn);
txnsRouter.get('/get-recent-txns', authenticate.checkAdmin, txnController.getRecentTxns);
txnsRouter.get('/exchange-stats', authenticate.checkAdmin, txnController.getExchangeStats);
txnsRouter.post('/address-txns', txnController.getAddressInputOutputTxns);
txnsRouter.post('/fetch-address-hash', txnController.receiveAddressSaveHashes);
txnsRouter.post('/grouped-address-txns', txnController.getGroupedAddressTxns);

// txnsRouter.get('/save-missed-txns', txnController.saveMissedHashes);
txnsRouter.get('/get-txns-hash', txnController.getTxnsByHash);
txnsRouter.get('/save-hash-from-address', txnController.saveHashFromAddress);
txnsRouter.get('/save-addresses', txnController.saveAddressFromHash);
txnsRouter.get('/update-alias', txnController.updateAddressAliasInTxns);
txnsRouter.get('/fees', txnController.getFees);
txnsRouter.get('/run-all', txnController.runAllJobs);
export default txnsRouter;  