import { getRouter } from "../../../utils/get-router";
import { getGenresHandler } from "./handlers/get-genres-handler";
import { getMoodsHandler } from "./handlers/get-moods-handler";

const router = getRouter();

router.get('/genres', getGenresHandler);
router.get('/moods', getMoodsHandler);

export {router as tagsRouter}