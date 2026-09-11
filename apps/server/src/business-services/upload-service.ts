import { writeFile } from 'fs/promises';
import path from 'path';

export class UploadService {
  private mode: string;
  private repo: any;
  constructor(repo: any) {
    this.repo = repo;
    this.mode = process.env.NODE_ENV;
  }

  private async uploadToLocalDisk(file: File) {
    const dest = path.resolve('/apps/server/uploads');
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(dest, buf);
  }

  private async uploadToCloudService(file: File) {
    throw new Error('Method not implemented!');
  }

  async upload(file: File) {
    if (this.mode === 'development') {
      await this.uploadToLocalDisk(file);
    } else {
      await this.uploadToCloudService(file);
    }
  }
}
