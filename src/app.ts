import express from "express"
import cors from "cors"
import mainRouter from "./presentation/route"




   const app = express()
   const PORT = process.env.PORT || 8000
   app.use(cors())
   app.use(express.json())

  
  app.use("/",mainRouter)


  app.listen(PORT, () => {
  console.log("server running")})



