// Importe les modules Sequelize et les dépendances nécessaires
module.exports = (sequelize, Sequelize) => {
  // Définit le modèle de données pour l'entité "Role"
  const LogSysteme = sequelize.define("logSysteme", {
    id: {
      type: Sequelize.INTEGER, // Type de données pour l'identifiant
      primaryKey: true, // L'identifiant est une clé primaire
      autoIncrement: true, // L'identifiant s'incrémente automatiquement
    },
    message: {
      type: Sequelize.STRING,
    },
    function:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    code:{
      type: Sequelize.STRING,
    }
  });

  return LogSysteme;
};
