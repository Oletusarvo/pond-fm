import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";

export const getMoodsHandler = createHandler(
    async (req, res) => {
        const moods = await db(tablenames.moods).pluck('label');
        return res.json(moods);
    }
)