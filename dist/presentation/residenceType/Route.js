"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateJWT_1 = require("../middleware/validateJWT");
const controller_1 = require("./controller");
const residenceTypeRouter = (0, express_1.Router)();
residenceTypeRouter.route("/")
    .all(validateJWT_1.validateJWT)
    .post(controller_1.createResidenceTypeController)
    .get(controller_1.getAllResidenceTypeController);
residenceTypeRouter.route("/:id")
    .all(validateJWT_1.validateJWT)
    .put(controller_1.editResidenceTypeController);
exports.default = residenceTypeRouter;
