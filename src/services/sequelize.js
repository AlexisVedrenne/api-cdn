const bcrypt = require("bcryptjs"); // Pour le hachage des mots de passe
const config = require("../config/auth.config.js"); // Configuration d'authentification
const db = require("../models/index.js"); // Modules de base de données
const Op = db.Sequelize.Op; // Opérateurs Sequelize
const Role = db.role; // Modèle Role depuis la base de données
const User = db.user; // Modèle User depuis la base de données
const logs = require("./log.js");
const TypeRecipe = db.recipeType;
const UnitMeasure = db.measureUnit;
const DietaryTag = db.dietaryTag;

async function createRoleBase() {
  try {
    const rolesToCreate = ["user", "admin","uploadImg"];
    // Création des rôles s'ils n'existent pas déjà
    await Promise.all(
      rolesToCreate.map(async (roleName) => {
        const [role, created] = await Role.findOrCreate({
          where: { name: roleName },
        });
      })
    );
  } catch (e) {
    console.log(e);
    logs.createErrorSysteme(e.message, "createRoleBase");
  }
}

async function createUserBase() {
  try {
    // Création des utilisateurs avec leurs rôles correspondants
    const usersData = [
      {
        lastName: "Vedrenne",
        name: "Alexis",
        mail: config.adminMail,
        password: bcrypt.hashSync(config.adminPassord, 8),
        timeAccess: 10000,
        roles: ["admin", "user"],
      },
    ];

    for (const data of usersData) {
      const [user, created] = await User.findOrCreate({
        where: { mail: data.mail },
        defaults: {
          password: data.password,
          timeAccess: data.timeAccess,
          mail: data.mail,
          name: data.name,
          lastName: data.lastName,
        },
      });
      const userRoles = await Role.findAll({
        where: {
          name: {
            [Op.in]: data.roles,
          },
        },
      });
      await user.setRoles(userRoles);
    }
  } catch (e) {
    console.log(e);
    logs.createErrorSysteme(e.message, "createUserBase");
  }
}

/**
 * Fonction d'initialisation des rôles et des utilisateurs
 */
async function initBdd() {
  try {
    await db.sequelize.sync({ force: false });
    await createRoleBase();
    await createUserBase();
    logs.createLogSysteme(`Base de donnée initialisée.`, "initBdd");
  } catch (e) {
    console.error(`Impossible d'initialiser la BDD : ${e.message}`);
  }
}

const sequelize = { initBdd: initBdd };

module.exports = sequelize;
