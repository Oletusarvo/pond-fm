import multer from 'multer';
import { extname } from 'path';
import { ExpressRequest } from './types/express';

const allowedMimetypes = ['audio/mpeg', 'audio/wav'];

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req: ExpressRequest, file, cb) => {
    const ext = extname(file.originalname);
    const filename = `${req.uploadToken.uploadId}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!allowedMimetypes.includes(file.mimetype)) {
      return cb(new Error('Unsupported audio format.'));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
});
