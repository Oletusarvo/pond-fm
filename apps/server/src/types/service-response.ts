import { serviceError } from '../utils/service-error';

type Values<T> = T extends unknown ? T[keyof T] : never;
export type ServiceErrorValue = Values<Values<typeof serviceError>>;

export type ServiceSuccessResponse<TData = null> = {
  success: true;
  data: TData;
};

export type ServiceErrorResponse<TError = ServiceErrorValue> = {
  success: false;
  error: TError;
};
export type ServiceResponse<TData = null, TError = ServiceErrorValue> =
  | ServiceSuccessResponse<TData>
  | ServiceErrorResponse<TError>;
