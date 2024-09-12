import { CreateEmailResponseSuccess, ErrorResponse } from "resend";
import resend from "../../Resend/resend";

type Props = {
    email:string,
    link:string
}

export const sendEmail = async({email,link}:Props) : Promise<[data?: CreateEmailResponseSuccess, error?: ErrorResponse]> => {

    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "hello world",
        html: `<div style='display: grid; grid-template-columns: 1'> <h2>Activa tu usuario en el siguiente enlace</h2> <a href='${link}' style='text-decoration: none'> <button style='background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;' role='button' aria-label='Click aquí para activar'> Click aquí para activar </button> </a> </div>`,
      });

      if(error){
        return [undefined,error]
      }

      return [data!]

      
}