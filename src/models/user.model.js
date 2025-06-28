// Importe les modules Sequelize et les dépendances nécessaires
module.exports = (sequelize, Sequelize) => {
  // Définit le modèle de données pour l'entité "User"
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER, // Type de données pour l'identifiant
      primaryKey: true, // L'identifiant est une clé primaire
      autoIncrement: true, // L'identifiant s'incrémente automatiquement
    },
    lastName: {
      type: Sequelize.STRING, // Type de données pour le nom (chaîne de caractères)
    },
    name: {
      type: Sequelize.STRING, // Type de données pour le nom (chaîne de caractères)
    },
    mail: {
      type: Sequelize.STRING, // Type de données pour le nom (chaîne de caractères)
    },
    password: {
      type: Sequelize.STRING, // Type de données pour le mot de passe (chaîne de caractères)
    },
    timeAccess: {
      type: Sequelize.INTEGER, // Type de données pour la durée d'accès (entier)
    },
    lastLogin: {
      type: Sequelize.STRING, // Type de données pour le mot de passe (chaîne de caractères)
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.shoppingList, {
      through: models.shoppingListShare,
      foreignKey: 'userId',
      otherKey: 'shoppingListId',
      as: 'sharedLists'
    });
  };

  return User; // Retourne le modèle de données "User" défini
};
