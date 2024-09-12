import express from "express"
import cors from "cors"
import mainRouter from "./route"

export const initServer = () => {

   const app = express()
   const PORT = process.env.PORT || 8000
   app.use(cors())
   app.use(express.json())

   
  app.use("/",mainRouter)


  app.listen(PORT, () => {
    console.log("server running")})

}