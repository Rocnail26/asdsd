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
exports.sendEmail = void 0;
const resend_1 = __importDefault(require("../../Resend/resend"));
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, link }) {
    const { data, error } = yield resend_1.default.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "hello world",
        html: `<div style='display: grid; grid-template-columns: 1'> <h2>Activa tu usuario en el siguiente enlace</h2> <a href='${link}' style='text-decoration: none'> <button style='background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;' role='button' aria-label='Click aquí para activar'> Click aquí para activar </button> </a> </div>`,
    });
    if (error) {
        return [undefined, error];
    }
    return [data];
});
exports.sendEmail = sendEmail;
