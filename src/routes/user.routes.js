// Importe les modules et les dépendances nécessaires
const { authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/user.controller");

const baseUrl = "/api/user";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)

  app.get(
    `${baseUrl}`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.getAllApi
  );
  app.get(
    `${baseUrl}/share`,
    [authJwt.verifyToken, logMiddleware.log],
    controller.getAllForShareApi
  );

  app.put(
    `${baseUrl}`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.update
  );

  app.put(
    `${baseUrl}/account`,
    [authJwt.verifyToken, logMiddleware.log],
    controller.updateAccount
  );
  // Endpoint pour mettre à jour les informations d'un user
  // Requiert un token d'accès, avec des vérifications pour le rôle "administrateur"

  app.put(
    `${baseUrl}/password`,
    [logMiddleware.log],
    controller.updatePassword
  );

  app.get(
    `${baseUrl}/:id`,
    [authJwt.verifyToken, authJwt.isAdministrateur, logMiddleware.log],
    controller.getOne
  );
  // Endpoint pour mettre à jour le mot de passe d'un user
  // Requiert un token d'accès, avec des vérifications pour le rôle "administrateur"

  app.delete(
    `${baseUrl}/:id`,
    [
      logMiddleware.setHeader,
      authJwt.verifyToken,
      authJwt.isAdministrateur,
      logMiddleware.log,
    ],
    controller.delete
  );
  app.post(
    `${baseUrl}`,
    [
      logMiddleware.setHeader,
      authJwt.verifyToken,
      authJwt.isAdministrateur,
      logMiddleware.log,
    ],
    controller.create
  );
  // Endpoint pour supprimer un user
  // Requiert un token d'accès, avec des vérifications pour le rôle "administrateur"
};
