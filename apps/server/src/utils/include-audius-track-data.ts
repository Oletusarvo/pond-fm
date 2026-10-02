import { audius } from "../audius.config";

export async function includeAudiusTrackData(
  feedFn: () => Promise<{
    items: any[];
    cursor: string;
  }>,
) {
  const data = await feedFn();
  if (data.items.length > 0) {
    return await processTracks(data);
  } else {
    return data;
  }
}

async function processTracks(data: any) {
  //Get track ids.
  const trackIds = data.items.map((track) => track.id);
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
    mergeTracks(track, audiusTrackMap.get(track.id), authorMap.get(track.author_id)),
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
    created_at,
    genre,
    moods,
  } = track;
  let mergedTrack: Record<string, any> = {
    id,
    title,
    description,
    duration,
    artwork: artwork["480x480"],
    play_count,
    unique_play_count,
    like_count,
    repost_count,
    reposted_by_me,
    liked_by_me,
    is_canonical,
    created_at,
    genre,
    moods,
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
