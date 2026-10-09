import { audius } from "../audius.config";
import { db } from "../db-config";
import { tablenames } from "../tablenames";

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

  let tracks = [];
  let deletedTracks = [];
  //Merge audius info with local tracks.
  for (const track of data.items) {
    const audiusTrack = audiusTrackMap.get(track.id);
    //If a track has been deleted on audius, skip it.
    if (!audiusTrack) {
      //Mark the track as deleted
      deletedTracks.push(track.id);
    }
    const audiusAuthor = authorMap.get(track.author_id);
    tracks.push(mergeTracks(track, audiusTrack, audiusAuthor));
  }

  if (deletedTracks.length > 0) {
    db(tablenames.tracks)
      .whereIn("id", deletedTracks)
      .update({ status: "deleted" })
      .catch((err) => console.log("Failed to delete tracks!", err.message));
  }

  const json = {
    cursor: data.cursor,
    items: tracks,
  };

  return json;
}

function mergeTracks(track, audiusTrack, author) {
  const { id, user, title, description, duration, artwork, permalink } = audiusTrack;
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
    artwork_mirrors: artwork.mirrors,
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
    permalink,
    canonical_author: {
      id: user.id,
      username: user.name,
      handle: user.handle,
    },
    author: {
      id: author.id,
      username: author.name,
      handle: user.handle,
    },
  };

  return mergedTrack;
}
