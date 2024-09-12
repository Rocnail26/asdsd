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
exports.getAllResidences = void 0;
const prisma_1 = require("../../db/prisma");
const getAllResidences = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { community_id, relations } = data;
    const query = {
        where: {
            community_id,
        },
    };
    if (relations) {
        query.omit = {
            community_id: true,
            owner_id: true,
            residenceType_id: true,
        };
        query.include = {
            Owner: true,
            Community: true,
            Expense: true,
            ResidenceType: true,
            Resident: true,
        };
    }
    try {
        const residences = yield prisma_1.prisma.residence.findMany(query);
        return residences;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllResidences = getAllResidences;
