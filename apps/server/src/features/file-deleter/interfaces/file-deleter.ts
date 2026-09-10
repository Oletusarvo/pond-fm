type TResult = {
  success: boolean;
};

export interface IFileDeleter {
  delete(keys: string[]): Promise<TResult>;
}
