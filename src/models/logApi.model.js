// Importe les modules Sequelize et les dépendances nécessaires
module.exports = (sequelize, Sequelize) => {
  // Définit le modèle de données pour l'entité "Role"
  const LogApi = sequelize.define("logApi", {
    id: {
      type: Sequelize.INTEGER, // Type de données pour l'identifiant
      primaryKey: true, // L'identifiant est une clé primaire
      autoIncrement: true, // L'identifiant s'incrémente automatiquement
    },
    method: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uri: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ipAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    statusCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    requestBody: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    responseBody: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    responseTime: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return LogApi;
};
