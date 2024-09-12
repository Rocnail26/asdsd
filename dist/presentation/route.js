"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("./auth/route"));
const route_2 = __importDefault(require("./residence/route"));
const Route_1 = __importDefault(require("./residenceType/Route"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/auth", route_1.default);
mainRouter.use("/residence", route_2.default);
mainRouter.use("/residenceType", Route_1.default);
exports.default = mainRouter;
