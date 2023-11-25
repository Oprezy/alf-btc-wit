"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/address.controller");
const addressRouter = (0, express_1.Router)();
addressRouter.get('/', address_controller_1.addressController.getAllAddresses);
addressRouter.get('/');
addressRouter.post('/');
exports.default = addressRouter;
