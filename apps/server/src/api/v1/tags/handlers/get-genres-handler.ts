import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";

export const getGenresHandler = createHandler(
    async (req, res) => {
        const genres = await db(tablenames.genres).pluck('label');
        return res.json(genres);
    }
)