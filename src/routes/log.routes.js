// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/log.controller");

const baseUrl = "/api/log";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    `${baseUrl}/api`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.getAllApi
  );

  app.get(
    `${baseUrl}/system`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.getAllSystem
  );

  app.delete(
    `${baseUrl}/all`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.purgeAllLog
  );

  app.delete(
    `${baseUrl}`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.setHeader],
    controller.purgeLog
  );
};
