import express from "express";
import cors from "cors"
import trackRoutes from "./routes/tracksRoutes.js"

const PORT = process.env.PORT ? Number(process.env.PORT) : 3003

const app = express();

//middlewares
app.use(express.json())
app.use(cors())

//routes
app.use("/api", trackRoutes)

app.listen(PORT, () => {
    console.log("Servidor Rodando...")
})


