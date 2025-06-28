// Importe les modules et les dépendances nécessaires
const { verifySignUp, authJwt, logMiddleware } = require("../middleware");
const controller = require("../controllers/auth.controller");

const baseUrl="/api/auth"

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)

  app.post(
    `${baseUrl}/signup`,
    [
      authJwt.verifyToken,
      verifySignUp.checkPassword,
      authJwt.isAdministrateur,
      verifySignUp.checkDuplicateUserMail,
      verifySignUp.checkRolesExisted,
      logMiddleware.log,
    ],
    controller.signup
  );

  app.post(
    `${baseUrl}/password`,
    [
      logMiddleware.log,
    ],
    controller.resetPassword
  );
  app.put(
    `${baseUrl}/account`,
    [authJwt.verifyToken],
    controller.updateAccount
  );
  app.delete(
    `${baseUrl}/account`,
    [authJwt.verifyToken],
    controller.deleteAccount
  );
  // Endpoint pour l'inscription d'un nouvel user
  // Requiert un token d'accès, le rôle d'administrateur, une vérification de nom d'user en double et de rôles existants

  app.post(`${baseUrl}/login`, [logMiddleware.log], controller.login);
  // Endpoint pour la connexion d'un user
  // Appelle la fonction de contrôleur "connexion"
};
