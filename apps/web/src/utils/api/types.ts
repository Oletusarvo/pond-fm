type TApiBaseResponse = {
  status?: number;
};

export type TApiSuccessResponse<T> = TApiBaseResponse & {
  success: true;
  data?: T;
};

export type TApiErrorResponse<E> = TApiBaseResponse & {
  success: false;
  error?: E;
};

export type TApiResponse<T = unknown, E = unknown> =
  | TApiSuccessResponse<T>
  | TApiErrorResponse<E>;
