"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertActivateUser = exports.insertLoginUser = exports.insertUserParams = void 0;
const zod_1 = require("zod");
const zod_2 = require("../db/zod");
const baseSchema = zod_2.UserSchema;
exports.insertUserParams = baseSchema.omit({
    id: true,
    isActive: true,
    isVerified: true,
}).omit({
    password: true,
}).extend({
    residence_id: zod_1.z.string().optional(),
    ownerOf: zod_1.z.string().optional()
});
exports.insertLoginUser = baseSchema.pick({
    password: true,
    email: true
});
exports.insertActivateUser = baseSchema.pick({
    password: true,
    id: true
});
