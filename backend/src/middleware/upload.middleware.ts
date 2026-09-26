import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadProductImages = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]);
