import { Response } from "express"

export const handleError = (res :Response, error:any) => {
    if(error instanceof Error) return res.status(400).json({error: error.message})
    
        return res.status(500).json({...error})
}