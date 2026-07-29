import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

/**Returns a track by its ID. */
export const getTrackByIdHandler = createHandler(async (req, res) => {
  const track = await postService.findTrackById(req.params.trackId as string, db);
  return res.status(200).json(track.data);
});
