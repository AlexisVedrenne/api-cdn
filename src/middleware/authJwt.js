const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.user;

// Middleware pour vérifier si un token d'accès est fourni et s'il est valide
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "Vous devez fournir un token !",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Ressource non autorisée !",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// Middleware pour vérifier si l'user a le rôle d'administrateur
isAdministrateur = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({
          message: "Ressource réservée.",
        });
        return;
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur : Token corrompu ou impossible de vérifier le rôle d'accès.",
      });
    });
};
isAdministrateurOrEditor = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin" || roles[i].name === "editor") {
            next();
            return;
          }
        }

        res.status(403).send({
          message: "Ressource réservée.",
        });
        return;
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur : Token corrompu ou impossible de vérifier le rôle d'accès.",
      });
    });
};

isAdministrateurOrUploadImg = async (req, res, next) => {
  try{
    const user = await User.findByPk(req.userId)
    const roles = await user.getRoles()
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin" || roles[i].name === "uploadImg") {
        next();
        return;
      }
    }
    res.status(403).send({
      message: "Ressource réservée.",
    });
  }catch(err){
    res.status(500).send({
      message:
        "Erreur : Token corrompu ou impossible de vérifier le rôle d'accès.",
    });
  }


};


const authJwt = {
  verifyToken: verifyToken,
  isAdministrateur: isAdministrateur,
  isAdministrateurOrEditor: isAdministrateurOrEditor,
  isAdministrateurOrUploadImg: isAdministrateurOrUploadImg,
};
module.exports = authJwt;
