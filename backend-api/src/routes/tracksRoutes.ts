import express from "express";
import { createTracks, getAllTracks } from "../controllers/tracks/tracks-controllers.js";

const router = express.Router();

//Aplicar rotas das faixas

router.get("/tracks", getAllTracks)
router.post("/tracks", createTracks)

export default router;

