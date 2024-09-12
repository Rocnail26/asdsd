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
exports.getResidenceController = exports.getAllRecidencesController = exports.createResidenceController = void 0;
const user_1 = require("../../services/user");
const Residence_1 = require("../../types/Residence");
const Residence_2 = require("../../services/Residence");
const createResidenceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, community_id } = req.body.user;
        const body = req.body;
        const admin = yield (0, user_1.isAdmin)(id);
        if (!admin)
            return res.status(403).json("invalid admin");
        const { data, error } = yield Residence_1.insertResidenceParams.safeParseAsync(Object.assign(Object.assign({}, body), { community_id }));
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const residence = yield (0, Residence_2.createResidence)(data);
        return res.status(202).json(residence);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error: error.message });
        return res.status(400).json(error);
    }
});
exports.createResidenceController = createResidenceController;
const getAllRecidencesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, community_id } = req.body.user;
        const { relations } = req.query;
        const admin = yield (0, user_1.isAdmin)(id);
        if (!admin)
            return res.status(403).json("invalid admin");
        console.log(relations);
        const { data, error } = yield Residence_1.insertGetAllResidenceParams.safeParseAsync({
            community_id,
            relations,
        });
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const residences = yield (0, Residence_2.getAllResidences)(data);
        return res.status(400).json(residences);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error: error.message });
        return res.status(500).json(error);
    }
});
exports.getAllRecidencesController = getAllRecidencesController;
const getResidenceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { community_id } = req.body.user;
        const { id } = req.params;
        const { data, error } = yield Residence_1.insertGetResidenceParams.safeParseAsync({ community_id, id });
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const residence = yield (0, Residence_2.getResidence)(data);
        console.log(residence);
        return res.json(residence);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error: error.message });
        return res.status(500).json(error);
    }
});
exports.getResidenceController = getResidenceController;
