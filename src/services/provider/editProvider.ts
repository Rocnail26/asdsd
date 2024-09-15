import { prisma } from "../../db/prisma";
import { EditProvider } from "../../types/Provider";




export const editProvider = async (data:EditProvider) => {
    const {id,community_id, ...rest} = data    
    try {
            const existProvider = await prisma.provider.findUnique({
                where:{
                    id,
                    community_id
                }
            })
            if(!existProvider) throw new Error("provider no encontrado")
            
            const provider = await prisma.provider.update({
                data: {
                    ...rest
                },
                where:{
                    id,
                    community_id
                }
            })

            return provider
        } catch (error) {
            throw error
        }
}