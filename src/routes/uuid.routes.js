// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/uuid.controller");
const baseRoute = "/api/uuid";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    `${baseRoute}/password/:uuid`,
    [logMiddleware.setHeader],
    controller.updatePassword
  );
};
