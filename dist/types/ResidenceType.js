"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertEditResidenceTypeParams = exports.insertResidenceTypeParams = void 0;
const zod_1 = require("zod");
const zod_2 = require("../db/zod");
const baseSchema = zod_2.ResidenceTypeSchema;
exports.insertResidenceTypeParams = baseSchema.omit({
    id: true,
});
exports.insertEditResidenceTypeParams = baseSchema.extend({
    id: zod_1.z.coerce.number()
});
