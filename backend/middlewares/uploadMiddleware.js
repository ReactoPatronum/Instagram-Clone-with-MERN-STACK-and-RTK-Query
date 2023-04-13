const multer = require("multer");
const sharp = require("sharp");

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Desteklenmeyen Format" }, false);
  }
};

const uploadPost = multer({
  storage: multer.diskStorage({}),
  fileFilter: filter,
  limits: { fieldSize: 20000000000 },
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 });
    })
  );
  next();
};

module.exports = { uploadPost, productImgResize };
