import { ExpressRequest } from "@pondfm/server-utils/src";
import { ContentMetadata } from "./content-metadata";

export type WithContentMetadata = {
  contentMetadata: ContentMetadata;
}