const db = require("../models"); // Importe le modèle de base de données.
const Role = db.role;
const { Op } = db.Sequelize;
const logs = require("../services/log");

// Fonction pour trouver un uuid par son ID.
exports.findOne = async (id) => {
  try {
    const role = await Role.findOne({
      where: {
        id: id,
      },
    });
    if (role) {
      return role;
    } else {
      return null;
    }
  } catch (e) {
    const message = `Impossible de récupérer le role. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    throw message;
  }
};
exports.findOneApi = async (req, res) => {
  try {
    const result = await this.findOne(req.params.id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Role introuvable." });
    }
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

exports.findAll = async () => {
  try {
    const role = await Role.findAll();
    return role;
  } catch (e) {
    const message = `Impossible de récupérer les roles. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    throw message;
  }
};

exports.findAllApi = async (req, res) => {
  try {
    const result = await this.findAll();
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e });
  }
};
