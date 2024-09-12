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
exports.activateUser = void 0;
const bcrypt_1 = require("bcrypt");
const prisma_1 = require("../../db/prisma");
const activateUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, password }) {
    try {
        const user = yield prisma_1.prisma.user.findUnique({ where: {
                id
            } });
        if (!user)
            throw new Error("usuario no encontrado");
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const result = yield prisma_1.prisma.user.update({
            data: {
                password: hashedPassword,
                isActive: true,
                isVerified: true
            },
            where: {
                id
            }
        });
        return true;
    }
    catch (error) {
        throw error;
    }
});
exports.activateUser = activateUser;
