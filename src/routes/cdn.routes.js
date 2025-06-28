// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/cdn.controller");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const config = require("../config/cdn.config");

const baseRoute = "/api/cdn";
const BASE_UPLOAD_DIR = config.cdnFolder || path.resolve(__dirname, "images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.params.folder;
    const uploadPath = path.join(BASE_UPLOAD_DIR, folder);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const upload = multer({ storage });

const replaceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.params.folder;
    const uploadPath = path.join(BASE_UPLOAD_DIR, folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const finalName = req.params.filename;
    cb(null, finalName);
  },
});

const uploadReplace = multer({ storage: replaceStorage });


module.exports = function (app) {
  app.post(
    `${baseRoute}/upload/img/:folder`,
    [
      logMiddleware.log,
      authJwt.verifyToken,
      authJwt.isAdministrateurOrUploadImg,
      upload.single("img"),
    ],
    controller.uploadImg
  );

  app.put(
    `${baseRoute}/upload/img/:folder/:filename`,
    [
      logMiddleware.log,
      authJwt.verifyToken,
      authJwt.isAdministrateurOrUploadImg,
      uploadReplace.single("img"),
    ],
    controller.updateImg
  );

  app.delete(
    `${baseRoute}/upload/img/:folder/:filename`,
    [
      logMiddleware.log,
      authJwt.verifyToken,
      authJwt.isAdministrateurOrUploadImg,
    ],
    controller.delete
  );

  app.get(
    `${baseRoute}`,
    [
      logMiddleware.log,
      authJwt.verifyToken,
      authJwt.isAdministrateurOrUploadImg,
    ],
    controller.getAllApi
  );
};
