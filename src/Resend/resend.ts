import { Resend } from "resend";

const resend = new Resend(process.env.API_RESEND);

export default resend