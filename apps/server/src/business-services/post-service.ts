import { DBContext } from "../types/db-context";
import { Knex } from "knex";
import { PostRepository } from "../repositories/post-repository";
import { serviceError } from "../utils/service-error";
import {
  ServiceErrorResponse,
  ServiceResponse,
  ServiceSuccessResponse,
} from "../types/service-response";

import { v4 } from "uuid";
import { createCanonicalPost } from "../DAL/posts/create-canonical-post";
import { createPost } from "../DAL/posts/create-post";
import { createTrackLike } from "../DAL/posts/create-track-like";
import { deleteTrackLike } from "../DAL/posts/delete-track-like";
import { getPostQuery } from "../DAL/posts/get-post-query";
import { tablenames } from "../tablenames";
import { db } from "../db-config";
import { withTrack } from "../DAL/posts/with/with-track";
import { TUpload } from "@pondfm/app-shared/dist/types/upload";
import { playCountThresholdSeconds, TTrack } from "@pondfm/app-shared";
import { createJWT, tryCatch } from "@pondfm/server-utils";

/**Responsible for handling business-logic related to individual posts and tracks. */
export class PostService {
  constructor(
    private repos: {
      postRepo: PostRepository;
    },
  ) {}

  async createCanonicalTrack(
    ctx: Knex.Transaction,
    config: Parameters<typeof createCanonicalPost>[1],
  ) {
    //Related business logic...
    const track = await this.repos.postRepo.createCanonicalTrack(ctx, config);
    return { success: true, data: track } as ServiceSuccessResponse<any>;
  }

  async repostTrack(ctx: DBContext, config: Parameters<typeof createPost>[1]) {
    //Related business logic.
    const [result, err] = await tryCatch(
      async () => await this.repos.postRepo.createPost(ctx, config),
    );
    if (err) {
      if (err.message.toLowerCase().includes("duplicate")) {
        return { success: false, error: serviceError.post?.duplicateRepost };
      } else {
        throw err;
      }
    }
    return { success: true };
  }

  async unrepostTrack(ctx: DBContext, config: { editor: { id: string }; track: { id: string } }) {
    //Prevent unreposting if the post isn't a repost, or if the editor isn't the one who reposted.
    const query = getPostQuery(ctx);
    query
      .where(function () {
        this.whereRaw("post_author.id <> track_author.id");
      })
      .where({
        "post?.track_id": config.track.id,
        "post_author.id": config.editor.id,
      })
      .del();

    return { success: true } as ServiceSuccessResponse;
  }

  /**Likes a posted track. */
  async likeTrack(ctx: DBContext, config: Parameters<typeof createTrackLike>[1]) {
    return await this.repos.postRepo
      .createTrackLike(ctx, config)
      .then(() => {
        return { success: true } as ServiceSuccessResponse;
      })
      .catch((err) => {
        const msg = err.message.toLowerCase();

        if (msg.includes("duplicate") && msg.includes("track_like_data_unique")) {
          return {
            success: false,
            error: serviceError.post?.duplicateLike,
          } as ServiceErrorResponse;
        } else {
          throw err;
        }
      });
  }

  async unlikeTrack(ctx: DBContext, config: Parameters<typeof deleteTrackLike>[1]) {
    await this.repos.postRepo.deleteTrackLike(ctx, config);
    return { success: true } as ServiceSuccessResponse<void>;
  }

  /**Returns a token allowing fetching of streams and counting plays.*/
  async createStreamToken(
    ctx: Knex.Transaction,
    options: {
      track: Pick<TTrack, "key" | "duration" | "id">;
      user: { session_id: string; id?: string };
    },
  ) {
    const { user, track } = options;
    const streamStarted = Date.now();
    //Stream start + duration of the track + a grace period of 10 seconds, in milliseconds.
    const expires = streamStarted + track.duration * 1000 + 10000;
    /**The fraction of the track duration after which a play can be counted. */
    const threshold = playCountThresholdSeconds / track.duration;
    /**The amount of time in seconds the track has to be listened to until a play can be counted. */
    const requiredListenTime = threshold ? threshold * track.duration : 159;
    const countValidAt = streamStarted + requiredListenTime * 1000;

    const [streamSession] = await ctx(tablenames.streamSessions)
      .insert({
        stream_started_at: new Date(streamStarted),
        play_countable_at: new Date(countValidAt),
        track_id: track.id,
        expires_at: new Date(expires),
        user_id: user.id,
        session_id: user.session_id,
        is_used: false,
      })
      .onConflict(["session_id", "track_id"])
      .merge()
      .returning("id");
    const token = createJWT({
      stream_session_id: streamSession.id,
    });
    return { success: true, data: token } as ServiceSuccessResponse<string>;
  }

  async updateTrack(
    ctx: Knex.Transaction,
    config: {
      editor: {
        id: string;
      };
      track: Partial<TTrack>;
    },
  ) {
    const track = await ctx(tablenames.tracks)
      .where({ id: config.track.id })
      .select("author_id")
      .first();
    if (track.author_id !== config.editor.id) {
      return;
    }
    await this.repos.postRepo.updateTrack(ctx, { ...config.track });
  }
}
