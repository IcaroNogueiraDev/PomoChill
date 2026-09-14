import { supabase } from "../../config/db.js";
import { handleError, handleSuccess } from "../../utils/handleResponse.js"
import type { Request, Response } from "express";

type Tracks = {
    name: string,
    artist: string,
    url: string,
}

const getAllTracks = async (req: Request, res: Response) => {
    try {
        const { data: tracks, error } = await supabase.from("tracks").select("*");

        if (error) {
            return handleError(res, 500, "Failed to fetch tracks")
        }

        if (!tracks || tracks.length === 0) {
            return handleError(res, 404, "Tracks not found")
        }

        handleSuccess(res, 200, "Tracks fetched successfully", tracks)

    } catch (error) {
        handleError(res, 500, "Internal Server Error")
    }
}

const createTracks = async (req: Request, res: Response) => {
    try {
        const { name, artist, url } = req.body as Tracks

        const { data: createdTrack, error } = await supabase.from("tracks").insert([{
            track_name: name,
            track_artist: artist,
            track_url: url
        }]).select();

        const data = createdTrack ? createdTrack[0] : null

        handleSuccess(res, 200, "Track created successfully", data)

    } catch (error) {
        handleError(res, 500, "Internal Server Error")
    }
}

const updateTracks = async (req: Request, res: Response) => {
    //criar depois
}

const deleteTracks = async (req: Request, res: Response) => {
    //criar depois
}

export { getAllTracks, createTracks }
