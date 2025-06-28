// Importe le modèle de base de données (db) et les rôles (ROLES)
const db = require("../models");
const constrollerRole = require("../controllers/role.controller");
const User = db.user;

// Middleware pour vérifier si le nom d'user est déjà utilisé
checkDuplicateUserMail = (req, res, next) => {
  // Recherche dans la base de données un user avec le même nom
  if (req.body.user.mail) {
    User.findOne({
      where: {
        mail: req.body.user.mail,
      },
    })
      .then((user) => {
        if (user) {
          // Si un user avec le même nom est trouvé, renvoie une erreur 400
          res.status(400).send({
            message: "Échec ! Le mail de l'user est déjà utilisé !",
          });
          return;
        }
        // Si aucun user avec le même nom n'est trouvé, passe à l'étape suivante
        next();
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Impossible de vérifier l'utilisateur." });
      });
  } else {
    res.status(400).send({ message: "Vous devez fournir un nom." });
  }
};

// Middleware pour vérifier si les rôles existent
checkRolesExisted = async (req, res, next) => {
  const roles = await constrollerRole.findAll();
  const authorizedRoleNames = roles.map((r) => r.name);
  if (req.body.user.roles) {
    // Si des rôles sont fournis dans la requête
    const hasValidRole = req.body.user.roles.some((role) =>
      authorizedRoleNames.includes(role)
    );
    if (!hasValidRole) {
      // Si le rôle n'existe pas dans la liste des rôles autorisés (ROLES)
      res.status(400).send({
        message: `Échec ! Le rôle ${req.body.user.roles[i]} n'existe pas `,
      });
      return;
    }
  }

  // Si tous les rôles existent, passe à l'étape suivante
  next();
};

checkPassword = (req, res, next) => {
  if (req.body.user.password) {
    if (req.body.user.password.length < 6) {
      res.status(400).send({
        message: `Le mot de passe doit faire au moins 6 caractères.`,
      });
      return;
    }
    next();
  } else {
    res.status(400).send({ message: "Vous devez fournir un mot de passe." });
  }
};

// Module d'exportation contenant les middlewares de vérification
const verifySignUp = {
  checkDuplicateUserMail: checkDuplicateUserMail, // Vérification du nom d'user en double
  checkRolesExisted: checkRolesExisted, // Vérification de l'existence des rôles
  checkPassword: checkPassword,
};

module.exports = verifySignUp;
