// Importe les modules Sequelize et les dépendances nécessaires
module.exports = (sequelize, Sequelize) => {
  // Définit le modèle de données pour l'entité "Role"
  const Cdn = sequelize.define("cdn", {
    id: {
      type: Sequelize.INTEGER, // Type de données pour l'identifiant
      primaryKey: true, // L'identifiant est une clé primaire
      autoIncrement: true, // L'identifiant s'incrémente automatiquement
    },
    folder: {
      type: Sequelize.STRING, // Type de données pour le nom du rôle (chaîne de caractères)
    },
    filename:{
      type:Sequelize.STRING
    },
    url:{
      type:Sequelize.STRING
    },
    type:{
      type:Sequelize.STRING
    }
  });

  return Cdn; // Retourne le modèle de données "Role" défini
};
