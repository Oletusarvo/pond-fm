import { Knex } from "knex";
import { db } from "../../../db-config";

export function selectPost(query: Knex.QueryBuilder) {
  query.select(
    'post.id as id',
    'track.status',
    'post.created_at',
    db.raw('post.author_id = track_author.id AS is_canonical'),
  );
  query.select('author.json as author');
}