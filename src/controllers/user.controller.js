const db = require("../models"); // Importe le modèle de base de données.
const User = db.user; // Récupère le modèle User.
const Role = db.role; // Récupère le modèle Role.
const bcrypt = require("bcryptjs"); // Importe la bibliothèque bcrypt pour le hachage de mot de passe.
const { Op } = db.Sequelize; // Récupère l'opérateur Sequelize (pour les opérations SQL).
const controllerUuid = require("./uuid.controller");
const Uuid = db.uuid;
const logs = require("../services/log");

// Fonction pour trouver un user par son ID.
exports.findOne = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
};

exports.findOneByMail = async (mail) => {
  try {
    const user = await User.findOne({
      where: {
        mail: {
          [Op.eq]: mail,
        },
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
};

// Fonction pour mettre à jour le mot de passe de l'user.
exports.updatePassword = async (req, res) => {
  try {
    const uuid = await controllerUuid.findOneByUuid(
      req.headers["x-access-uuid"]
    );
    if (uuid) {
      await User.update(
        {
          password: bcrypt.hashSync(req.body.password, 8),
        },
        {
          where: {
            id: {
              [Op.eq]: uuid.user.id,
            },
          },
        }
      );
      await Uuid.destroy({
        where: {
          id: {
            [Op.eq]: uuid.id,
          },
        },
      });
      res.send({ message: "Mot de passe utilisateur mis à jour." });
    } else {
      res
        .status(404)
        .send({ message: "UUID introuvable pour changer le mot de passe." });
    }
  } catch (e) {
    const message = `Impossible de mettre à jour le mot de passe. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "updatePassword");
    res.status(500).send({ message: message });
  }
};

// Fonction pour obtenir un user par son ID.
exports.getOne = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await this.findOne(id, res);
    if (user) {
      res.send(user);
    }
  } catch (e) {
    const message = `Erreur lors de la récupération de l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getOne");
    res.status(500).send({ message: message });
  }
};

// Fonction pour obtenir tous les utilisateurs (à l'exclusion du mot de passe).
exports.getAll = async (page = 1, pageSize = 10, userId) => {
  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await User.findAndCountAll({
      limit: pageSize,
      offset,
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
      where: {
        id: {
          [Op.ne]: userId,
        },
      },
    });
    return {
      totalItems: parseInt(count),
      totalPages: Math.ceil(parseInt(count) / parseInt(pageSize)),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (e) {
    const message = `Impossible de récupérer la liste des utilisateurs.. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    throw message;
  }
};

exports.getAllApi = async (req, res) => {
  try {
    const result = await this.getAll(
      req.query.page,
      req.query.pageSize,
      req.userId
    );
    res.send(result);
  } catch (e) {
    const message = `Impossible de récupérer la liste des utilisateurs.. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};

exports.getAllForShare = async (page = 1, pageSize = 10, userId) => {
  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await User.findAndCountAll({
      limit: pageSize,
      offset,
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "lastLogin",
          "timeAccess",
        ],
      },
      where: {
        id: {
          [Op.ne]: userId,
        },
      },
    });
    return {
      totalItems: parseInt(count),
      totalPages: Math.ceil(parseInt(count) / parseInt(pageSize)),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (e) {
    const message = `Impossible de récupérer la liste des utilisateurs.. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    throw message;
  }
};

exports.getAllForShareApi = async (req, res) => {
  try {
    const result = await this.getAllForShare(
      req.query.page,
      req.query.pageSize,
      req.userId
    );
    res.send(result);
  } catch (e) {
    const message = `Impossible de récupérer la liste des utilisateurs.. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};

// Fonction pour supprimer un user par son ID
exports.delete = async (req, res) => {
  try {
    const user = await this.findOne(req.params.id, res);
    if (user) {
      await User.destroy({
        where: {
          id: {
            [Op.eq]: req.params.id,
          },
        },
      });
      res.send({ message: "Utilisateur supprimé." });
    } else {
      res.status(404).send({ message: "Utilisateur introuvable." });
    }
  } catch (e) {
    const message = `Impossible de supprimer l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "delete");
    res.status(500).send({ message: message });
  }
};

// Fonction pour mettre à jour les informations d'un user.
exports.update = async (req, res) => {
  try {
    const user = await this.findOne(req.body.user.id);
    if (user) {
      await User.update(req.body.user, {
        where: {
          id: {
            [Op.eq]: user.id,
          },
        },
      });
      if (req.body.user.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.user.roles,
            },
          },
        });
        await user.setRoles(roles).then(async () => {
          const userLogin = await User.findOne({
            attributes: ["id", "lastName", "name", "mail", "lastLogin"],
            where: {
              id: user.id,
            },
            include: [
              {
                model: Role,
                as: "roles",
              },
            ],
          });
          res.send({ message: "Mise à jour réussite.", user: userLogin });
        });
      } else {
        const userLogin = await User.findOne({
          attributes: ["id", "lastName", "name", "mail", "lastLogin"],
          where: {
            id: user.id,
          },
          include: [
            {
              model: Role,
              as: "roles",
            },
          ],
        });
        res.send({ message: "Mise à jour réussite.", user: userLogin });
      }
    } else {
      res.status(404).send({ message: "Utilisateur introuvable." });
    }
  } catch (e) {
    const message = `Impossible de supprimer l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};

exports.create = async (req, res) => {
  try {
    const randomPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-4);
    const rolesToAdd = req.body.roles;
    req.body.password = bcrypt.hashSync(randomPassword, 8);
    const newUser = await User.create(req.body);
    if (rolesToAdd) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: rolesToAdd,
          },
        },
      });
      await newUser.setRoles(roles);
      res.send({
        message: `Utilisateur ${newUser.lastName} ${newUser.name} est bien enregistré !`,
      });
    } else {
      await newUser.setRoles([1]);
      res.send({
        message: `Utilisateur ${newUser.lastName} ${newUser.name} est bien enregistré !`,
      });
    }
  } catch (e) {
    const message = `Impossible de créer l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "create");
    res.status(500).send({ message: message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const user = await this.findOne(req.userId);
    if (user) {
      await User.update(req.body.user, {
        where: {
          id: {
            [Op.eq]: user.id,
          },
        },
      });
      if (req.body.user.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.user.roles,
            },
          },
        });
        await user.setRoles(roles).then(async () => {
          const userLogin = await User.findOne({
            attributes: ["id", "lastName", "name", "mail", "lastLogin"],
            where: {
              id: user.id,
            },
            include: [
              {
                model: Role,
                as: "roles",
              },
            ],
          });
          res.send({ message: "Mise à jour réussite.", user: userLogin });
        });
      } else {
        const userLogin = await User.findOne({
          attributes: ["id", "lastName", "name", "mail", "lastLogin"],
          where: {
            id: user.id,
          },
          include: [
            {
              model: Role,
              as: "roles",
            },
          ],
        });
        res.send({ message: "Mise à jour réussite.", user: userLogin });
      }
    } else {
      res.status(404).send({ message: "Utilisateur introuvable." });
    }
  } catch (e) {
    const message = `Impossible de supprimer l'utilisateur. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "getAll");
    res.status(500).send({ message: message });
  }
};
