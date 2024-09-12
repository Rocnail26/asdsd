
import jwt from "jsonwebtoken"




export const verifyToken =  <T>(token:string):Promise<T> => {
    
    return new Promise((resolve,reject) => {

        jwt.verify(token,process.env.SECRET!,(error,decoded)=> {
            if(error){
                reject(error)
            }
            resolve(decoded as T)
        })

    })
  
}