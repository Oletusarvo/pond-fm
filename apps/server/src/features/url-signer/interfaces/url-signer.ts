type TAudioContentType = 'audio/mpeg' | 'audio/wav';

export type TUploadSignCommand = {
  key: string;
  contentLength: number;
  contentType: TAudioContentType;
};

export type TStreamSignCommand = {
  key: TUploadSignCommand['key']
};

export interface IUrlSigner {
  upload: {
    sign(command: TUploadSignCommand): Promise<string>;
  };
  stream: {
    sign(command: TStreamSignCommand): Promise<string>;
  }
}