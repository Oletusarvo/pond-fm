import multer from 'multer';

const allowedMimetypes = ['audio/mpeg', 'audio/wav'];

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
