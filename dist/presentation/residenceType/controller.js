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
exports.editResidenceTypeController = exports.getAllResidenceTypeController = exports.createResidenceTypeController = void 0;
const user_1 = require("../../services/user");
const createResideceType_1 = require("../../services/residenceType/createResideceType");
const ResidenceType_1 = require("../../types/ResidenceType");
const residenceType_1 = require("../../services/residenceType");
const createResidenceTypeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const isValidAdmin = yield (0, user_1.isAdmin)(id);
        if (!isValidAdmin)
            res.status(403).json({ error: "admin invalido" });
        const { error, data } = yield ResidenceType_1.insertResidenceTypeParams.safeParseAsync(Object.assign(Object.assign({}, body), { community_id }));
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const residenceType = yield (0, createResideceType_1.createResidenceType)(data);
        res.status(202).json(residenceType);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error: error.message });
        return res.status(400).json({ error });
    }
});
exports.createResidenceTypeController = createResidenceTypeController;
const getAllResidenceTypeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { community_id } = req.body.user;
        const residenceTypes = yield (0, residenceType_1.getAllResidenceType)(community_id);
        return res.json(residenceTypes);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error: error.message });
        return res.status(500);
    }
});
exports.getAllResidenceTypeController = getAllResidenceTypeController;
const editResidenceTypeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId, community_id } = req.body.user;
        const { id } = req.params;
        const body = req.body;
        const isValidAdmin = yield (0, user_1.isAdmin)(userId);
        if (!isValidAdmin)
            res.status(403).json({ error: "admin invalido" });
        const { data, error } = yield ResidenceType_1.insertEditResidenceTypeParams.safeParseAsync(Object.assign(Object.assign({}, body), { id, community_id }));
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const residenceType = yield (0, residenceType_1.editResidenceType)(data);
        return res.json(residenceType);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error: error.message });
        return res.status(500);
    }
});
exports.editResidenceTypeController = editResidenceTypeController;
