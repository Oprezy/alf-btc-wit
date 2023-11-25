"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const txns_entity_1 = require("./entities/txns.entity");
const address_entity_1 = require("./entities/address.entity");
const exchange_entity_1 = require("./entities/exchange.entity");
const address_router_1 = __importDefault(require("./routers/address.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/address', address_router_1.default);
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '',
    database: 'btcs',
    entities: [address_entity_1.Address, txns_entity_1.Txns, exchange_entity_1.Exchange],
    synchronize: true,
});
exports.AppDataSource.initialize().then(() => {
    const PORT = 2010;
    app.listen(PORT, () => console.log("app running on port " + PORT));
});
