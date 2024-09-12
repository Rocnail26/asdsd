"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateJWT_1 = require("../middleware/validateJWT");
const controller_1 = require("./controller");
const residenceRouter = (0, express_1.Router)();
residenceRouter.route("/")
    .all(validateJWT_1.validateJWT)
    .post(controller_1.createResidenceController)
    .get(controller_1.getAllRecidencesController);
residenceRouter.route("/:id")
    .all(validateJWT_1.validateJWT)
    .get(controller_1.getResidenceController);
exports.default = residenceRouter;
