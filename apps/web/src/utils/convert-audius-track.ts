import { TTrackPublic } from "@pondfm/app-shared";

export function convertAudiusTrack(audiusTrack: any): TTrackPublic {
  return {
    title: audiusTrack.title,
    duration: audiusTrack.duration,
    description: audiusTrack.description,
    genre: audiusTrack.genre,
    mood: audiusTrack.mood,
    author: {
      id: audiusTrack.owner,
    },
    stats: {
      play_count: audiusTrack.play_count,
      repost_count: audiusTrack.repost_count,
      like_count: audiusTrack.favourite_count,
    },
  } satisfies TTrackPublic;
}
