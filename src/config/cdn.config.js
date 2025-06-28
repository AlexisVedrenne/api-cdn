// Import du module 'dotenv' pour la configuration des variables d'environnement
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });

// Export d'un objet contenant différentes valeurs récupérées depuis les variables d'environnement
module.exports = {
  cdnFolder: process.env[`BASE_FOLDER`],
  cdnDomaine: process.env[`CDN_DOMAINE`]
};
