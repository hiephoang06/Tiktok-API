import expess from 'express';
import VideoController from '../../app/controllers/VideoController.js';
import slugify from 'slugify';
import multer from 'multer';

const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'video/mp4') return cb(null, './public/videos');
    return cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    const name = slugify(file.originalname, { lower: true });
    cb(null, `${new Date().getTime()}-${name}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!whitelist.includes(file.mimetype)) {
    return cb(new Error('file is not allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
// const upload = multer({ dest: './public/videos' });
export const router = expess.Router();
router.get('/', VideoController.getVideos);
router.post('/', upload.single('uploaded_file'), VideoController.uploadVideo);
