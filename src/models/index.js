// Import des configurations de la base de données depuis db.config.js
const config = require("../config/db.config.js");
// Import du module Sequelize pour la gestion de la base de données
const Sequelize = require("sequelize");

// Fonction pour établir une connexion à la base de données MSSQL
function connect() {
  try {
    // Crée et retourne une nouvelle instance Sequelize avec les configurations fournies
    return new Sequelize(config.DB, config.USER, config.PASSWORD, {
      host: config.HOST, // Adresse du serveur de base de données
      dialect: config.DIALECT,
      logging: false, // Type de base de données (MSSQL dans ce cas)
      port: config.PORT, // Port de connexion à la base de données
      pool: {
        max: 5, // Nombre maximal de connexions dans le pool
        min: 0, // Nombre minimal de connexions dans le pool
        acquire: 30000, // Temps maximum d'attente pour obtenir une connexion
        idle: 10000, // Durée d'inactivité avant qu'une connexion soit relâchée
      },
    });
  } catch (e) {
    console.log(e.message); // Gestion des erreurs en cas d'échec de la connexion
  }
}

// Établit une connexion à la base de données en utilisant la fonction connect
const sequelize = connect();

// Crée un objet db pour stocker les modèles et les relations de la base de données
const db = {};

// Expose les modules Sequelize et la connexion à la base de données
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importe et associe les modèles de la base de données avec Sequelize
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.logApi = require("./logApi.model.js")(sequelize, Sequelize);
db.logSysteme = require("./logSysteme.model.js")(sequelize, Sequelize);
db.uuid = require("./uuid.model.js")(sequelize, Sequelize);

// Import des modèles liés aux recettes
db.recipe = require("./recipe.model.js")(sequelize, Sequelize);
db.recipeType = require("./recipeType.model.js")(sequelize, Sequelize);
db.recipeStep = require("./recipeStep.model.js")(sequelize, Sequelize);
db.ingredient = require("./ingredient.model.js")(sequelize, Sequelize);
db.ingredientType = require("./ingredientType.model.js")(sequelize, Sequelize);
db.measureUnit = require("./measureUnit.model.js")(sequelize, Sequelize);
db.recipeIngredient = require("./recipeIngredient.model.js")(sequelize, Sequelize);
db.recipeStepIngredient = require("./recipeStepIngredient.model.js")(sequelize, Sequelize);

// Import des nouveaux modèles
const { DietaryTag, RecipeDietaryTag } = require("./dietaryTag.model.js")(sequelize, Sequelize);
db.dietaryTag = DietaryTag;
db.recipeDietaryTag = RecipeDietaryTag;

db.ingredientPrice = require("./ingredientPrice.model.js")(sequelize, Sequelize);
db.nutritionalValue = require("./nutritionalValue.model.js")(sequelize, Sequelize);
db.userRecipeCollection = require("./userRecipeCollection.model.js")(sequelize, Sequelize);
db.recipeReview = require("./recipeReview.model.js")(sequelize, Sequelize);
db.mealPlan = require("./mealPlan.model.js")(sequelize, Sequelize);

const { ShoppingList, ShoppingListItem } = require("./shoppingList.model.js")(sequelize, Sequelize);
db.shoppingList = ShoppingList;
db.shoppingListItem = ShoppingListItem;

db.shoppingListRecipe = require("./shoppingListRecipe.model.js")(sequelize, Sequelize);
db.shoppingListShare = require("./shoppingListShare.model.js")(sequelize, Sequelize);

db.mealPlanParent = require("./mealPlanParent.model.js")(sequelize, Sequelize);
db.mealPlanShare = require("./mealPlanShare.model.js")(sequelize, Sequelize);

// Définit les relations entre les entités user et rôle
db.role.belongsToMany(db.user, {
  through: "utilisateur_roles",
});
db.user.belongsToMany(db.role, {
  through: "utilisateur_roles",
});

db.uuid.belongsTo(db.user, {
  as: "user",
  foreignKey: "utilisateurId",
});

// Appliquer les associations pour tous les modèles
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Définit un tableau de rôles possibles
db.ROLES = ["user", "admin"];

// Exporte l'objet db contenant les modèles, les relations et les rôles
module.exports = db;
