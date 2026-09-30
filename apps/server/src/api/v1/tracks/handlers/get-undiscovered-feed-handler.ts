import { db } from "../../../../db-config";
import { getUndiscoveredPosts } from "../../../../DAL/posts/get-undiscovered-posts";

import { asArray } from "../../../../utils/as-array";

import { getCursor } from "../../../../utils/get-cursor";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { getUndiscoveredTracks } from "../../../../DAL/tracks/get-undiscovered-tracks";
import { audius, audiusSdk } from "../../../../audius.config";
import { TTrackPublic } from "@pondfm/app-shared";

/**Returns the main track feed. */
export const getUndiscoveredTracksHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const cursor = getCursor(req);
    const { genres, moods } = req.query as {
      genres?: string[] | string;
      moods?: string[] | string;
    };
    const session = req.session || null;
    const data = await getUndiscoveredTracks(db, {
      cursor,
      session,
      genres: asArray(genres),
      moods: asArray(moods),
    });

    const json = await processTracks(data);

    console.log(json);
    return res.json(json);
  },
);

function transformTracks(audiusTracks: any[]) {
  return audiusTracks.map((track) => {
    const { id, user, title, description, duration, artwork } = track;
    return {
      id,
      title,
      description,
      artwork,
      duration,
      author: {
        audius_user_id: user.id,
        username: user.name,
      },
    };
  });
}

async function processTracks(data: any) {
  //Get track ids.
  const trackIds = data.items.map((track) => track.audius_track_id);
  //Fetch other information from audius.
  const audiusTracks = await audius.tracks.get(trackIds);
  const audiusTrackMap = new Map(audiusTracks.map((t) => [t.id, t]));
  //Author data if not canonical.
  const authorIdSet = new Set<string>(
    data.items.map((t) => [t.author_id, t.canonical_author_id]).flatMap((arr) => arr),
  );
  const authorData = await audius.users.get(Array.from(authorIdSet));
  const authorMap = new Map(authorData.map((a) => [a.id, a]));

  //Merge audius info with local tracks.
  const tracks = data.items.map((track) =>
    mergeTracks(track, audiusTrackMap.get(track.audius_track_id), authorMap.get(track.author_id)),
  );

  const json = {
    cursor: data.cursor,
    items: tracks,
  };

  return json;
}

function mergeTracks(track, audiusTrack, author) {
  const { id, user, title, description, duration, artwork } = audiusTrack;
  const {
    play_count,
    unique_play_count,
    like_count,
    repost_count,
    reposted_by_me,
    liked_by_me,
    is_canonical,
  } = track;
  let mergedTrack: Record<string, any> = {
    id,
    title,
    description,
    duration,
    artwork,
    play_count,
    unique_play_count,
    like_count,
    repost_count,
    reposted_by_me,
    liked_by_me,
    is_canonical,
    canonical_author: {
      id: user.id,
      username: user.name,
    },
    author: {
      id: author.id,
      username: author.name,
    },
  };

  return mergedTrack;
}
