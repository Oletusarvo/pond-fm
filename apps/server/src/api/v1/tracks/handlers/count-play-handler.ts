import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

export const countPlayHandler = createHandler(async (req, res) => {
  const { trackId } = req.body as { trackId: string };
  await postService.countPlay(trackId, db);
  return res.end();
});
