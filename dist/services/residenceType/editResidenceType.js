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
exports.editResidenceType = void 0;
const prisma_1 = require("../../db/prisma");
const editResidenceType = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, community_id, description, title } = data;
        const residenceType = yield prisma_1.prisma.residenceType.findUnique({
            where: {
                id: id,
                community_id
            }
        });
        if (!residenceType)
            throw new Error("no existe el tipo de residencia");
        return yield prisma_1.prisma.residenceType.update({
            where: {
                id
            },
            data: {
                description,
                title
            }
        });
    }
    catch (error) {
        throw error;
    }
});
exports.editResidenceType = editResidenceType;
