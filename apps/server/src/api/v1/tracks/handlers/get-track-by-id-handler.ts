import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

/**Returns a track by its ID. */
export const getTrackByIdHandler = createHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const track = await postService.findTrackById(id, db);
  return res.status(200).json(track.data);
});
