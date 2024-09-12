"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const validateJWT_1 = require("../middleware/validateJWT");
const authRouter = (0, express_1.Router)();
authRouter.route("/")
    .post(controller_1.registerUserController)
    .get(validateJWT_1.validateJWT, controller_1.revalidateTokenController);
authRouter.route("/login")
    .post(controller_1.loginUserController);
authRouter.route("/:token")
    .put(controller_1.activateUserController);
exports.default = authRouter;
