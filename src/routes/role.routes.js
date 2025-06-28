// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/role.controller");

const baseUrl = "/api/role";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    `${baseUrl}/all`,
    [authJwt.verifyToken,authJwt.isAdministrateur, logMiddleware.log],
    controller.findAllApi
  );
  app.get(
    `${baseUrl}/:id`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.findOneApi
  );
};
