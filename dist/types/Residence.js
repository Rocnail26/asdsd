"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertGetResidenceParams = exports.insertGetAllResidenceParams = exports.insertResidenceParams = void 0;
const zod_1 = require("zod");
const zod_2 = require("../db/zod");
const baseSchema = zod_2.ResidenceSchema;
exports.insertResidenceParams = baseSchema.omit({
    contacts: true,
    id: true,
    owner_id: true,
});
exports.insertGetAllResidenceParams = baseSchema.extend({
    relations: zod_1.z.coerce.boolean().optional()
}).pick({
    relations: true,
    community_id: true
});
exports.insertGetResidenceParams = baseSchema.pick({
    id: true,
    community_id: true
});
