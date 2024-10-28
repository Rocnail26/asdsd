import { Request, Response } from "express";
import {  insertActivateUser, insertLoginUser, insertUserParams } from "../../types/User";
import { registerUser, loginUser, activateUser } from "../../services/auth";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/email/verifyUser";
import { verifyToken } from "../../lib/verifyToken";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const basePath = req.body.basePath;

    let {data,error} = await insertUserParams.safeParseAsync(body);
    if (!basePath) return res.status(400).json({ error: "falta el BasePath" });
    if (error)
      return res
        .status(400)
        .json({ error: error.flatten().fieldErrors });

      
    let newUser = await registerUser(data!);
   
    // enviar correo aqui

    const payload = {id:newUser.id}
    const token =  jwt.sign(payload,process.env.SECRET!,{
      expiresIn: "24h"
    })

    const [, errorEmail] = await sendEmail({email:"condominios59@gmail.com",link:`${basePath}/${token}`})

    if(errorEmail){
      console.log(error)
     return res.status(400).json({error:"error en el envio de correo usuario debe verificar correo"})
    }

    return res.status(201).json(newUser);
  } catch (error) {
    // grabar logs o enviar
    if (error instanceof Error) {
      console.log(error)
      return res.status(400).json(error.message);
    }
    return res.status(500);
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { error, data } = await insertLoginUser.safeParseAsync(body);
    if (error)
      return res.status(400).json({ error: error.flatten().fieldErrors });
    const user = await loginUser(data);
    
    if (!user.isVerified)
      return res.status(403).json({ error: "email no autenticado" });

    const payload = {
      id: user.id,
      community_id: user.community_id
    };

    const token = jwt.sign(payload, process.env.SECRET!, {
      expiresIn: "7d",
    });

    return res.json({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json(error.message);
    }
    res.status(500)
  }
};


export const revalidateTokenController = async (req:Request,res:Response) => {
  const {id} = req.body.user

  const token = jwt.sign({id},process.env.SECRET!,{
    expiresIn: "7d"
  })

  res.json({token})

}

export const activateUserController = async (req:Request,res:Response) => {
  
 try {
  
  const {token} = req.params
  const body = req.body
  const user = await verifyToken<{id:string}>(token)
  const {data,error} = await insertActivateUser.safeParseAsync({...body,id:user.id})
  if(error) return res.status(400).json({error:error.flatten().fieldErrors})
  const result = await activateUser(data)
  return res.json({message:"usuario actualizado"})
  
 } catch (error) {
    if(error instanceof Error){
      console.log(res.json({error: error.message}))
       res.status(500)
    }
    console.log(error)
 }

}