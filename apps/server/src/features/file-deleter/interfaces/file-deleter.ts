type TResult = {
  success: boolean;
};

export interface IFileDeleter {
  del(keys: string[]): Promise<TResult>;
}
