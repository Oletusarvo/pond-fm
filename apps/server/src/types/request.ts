import { TSession } from "@pondfm/app-shared";
import { ExpressRequest } from "@pondfm/server-utils";

type TData = Record<string, unknown> | undefined;

export type TRequest<T = unknown> = ExpressRequest<T> & {
  sessionToken: {
    id: string;
  };
};

export type TAuthenticatedRequest<T = unknown> = TRequest<T> & {
  session: TSession;
};

export type WithUploadToken<T extends TRequest> = T & {
  uploadToken: {
    uploadId: string;
    userId: string;
    code: string;
    key: string;
  };
};

export type WithStreamToken<T extends TRequest> = T & {
  streamToken?: {
    expires: number;
    trackId: string;
    id: string;
    streamStarted: number;
    countValidAt: number;
  };
};
