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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUserController = exports.revalidateTokenController = exports.loginUserController = exports.registerUserController = void 0;
const User_1 = require("../../types/User");
const auth_1 = require("../../services/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyUser_1 = require("../../services/email/verifyUser");
const verifyToken_1 = require("../../lib/verifyToken");
const registerUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const basePath = req.body.basePath;
        let userParams = yield User_1.insertUserParams.safeParseAsync(body);
        if (!basePath)
            return res.status(400).json({ error: "falta el BasePath" });
        if (userParams.error)
            return res
                .status(400)
                .json({ error: userParams.error.flatten().fieldErrors });
        let newUser = yield (0, auth_1.registerUser)(userParams.data);
        // enviar correo aqui
        const payload = { id: newUser.id };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, {
            expiresIn: "24h"
        });
        const [, error] = yield (0, verifyUser_1.sendEmail)({ email: "condominios59@gmail.com", link: `${basePath}/${token}` });
        if (error) {
            console.log(error);
            return res.status(400).json({ error: "error en el envio de correo usuario debe verificar correo" });
        }
        return res.status(201).json(newUser);
    }
    catch (error) {
        // grabar logs o enviar
        if (error instanceof Error) {
            console.log(error);
            return res.status(400).json(error.message);
        }
        return res.status(500);
    }
});
exports.registerUserController = registerUserController;
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error, data } = yield User_1.insertLoginUser.safeParseAsync(body);
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const user = yield (0, auth_1.loginUser)(data);
        if (!user.isVerified)
            return res.status(403).json({ error: "email no autenticado" });
        const payload = {
            id: user.id,
            community_id: user.community_id
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, {
            expiresIn: "7d",
        });
        return res.json({ user, token });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json(error.message);
        }
        res.status(500);
    }
});
exports.loginUserController = loginUserController;
const revalidateTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    const token = jsonwebtoken_1.default.sign({ id }, process.env.SECRET, {
        expiresIn: "7d"
    });
    res.json({ token });
});
exports.revalidateTokenController = revalidateTokenController;
const activateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const body = req.body;
        const user = yield (0, verifyToken_1.verifyToken)(token);
        const { data, error } = yield User_1.insertActivateUser.safeParseAsync(Object.assign(Object.assign({}, body), { id: user.id }));
        if (error)
            return res.status(400).json({ error: error.flatten().fieldErrors });
        const result = yield (0, auth_1.activateUser)(data);
        return res.json({ message: "usuario actualizado" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(res.json({ error: error.message }));
            res.status(500);
        }
        console.log(error);
    }
});
exports.activateUserController = activateUserController;
