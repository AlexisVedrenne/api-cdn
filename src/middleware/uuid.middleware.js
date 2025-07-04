const db = require("../models");
const uuidController = require("../controllers/uuid.controller");

// Middleware pour vérifier si un token d'accès est fourni et s'il est valide
verifyUuid = async (req, res, next) => {
  let tokenUuid = req.headers["x-access-uuid"];
  if (!tokenUuid) {
    return res.status(403).send({
      message: "Aucun UUID n'est fournie.",
    });
  } else {
    const uuid = await uuidController.findOneByUuid(tokenUuid);
    if (uuid) {
      next();
    } else {
      return res.status(404).send({ message: "Uuid invalide." });
    }
  }
};

const uuidMiddleware = {
  verifyUuid: verifyUuid,
};
module.exports = uuidMiddleware;
