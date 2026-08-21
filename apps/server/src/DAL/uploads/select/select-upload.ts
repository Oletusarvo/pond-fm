import { Knex } from "knex";

export function selectUpload(query: Knex.QueryBuilder) {
  query.select('upload.id', 'upload.filename', 'upload.mime_type', 'upload.status', 'upload.key', 'upload.upload_folder_id');
}