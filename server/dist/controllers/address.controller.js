"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressController = void 0;
const address_entity_1 = require("../entities/address.entity");
const index_1 = require("../index");
class AddressController {
    constructor() {
        this.getAllAddresses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let allAddresses;
            try {
                allAddresses = yield index_1.AppDataSource.getRepository(address_entity_1.Address).find();
            }
            catch (error) {
                console.error(error);
            }
            return res.send(allAddresses);
        });
    }
}
exports.addressController = new AddressController();
