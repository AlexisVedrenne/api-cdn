// Importe le module Express pour créer l'application
const express = require("express");
const cookieParser = require("cookie-parser"); // Middleware pour gérer les cookies
const helmet = require("helmet"); // Middleware pour sécuriser l'application
const rateLimit = require("express-rate-limit");
// Importe le module Morgan pour la journalisation des requêtes HTTP
const logger = require("morgan");
const cors = require("cors"); // Middleware pour gérer les requêtes CORS
function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

// Crée une instance d'application Express
const app = express();

const port = normalizePort(process.env.API_PORT); // Normalisation du port
app.set("port", port); // Configuration du port de l'application
app.use(express.json()); // Middleware pour traiter les données JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour traiter les données de formulaire
app.use(cookieParser()); // Middleware pour gérer les cookies
app.use(helmet()); // Middleware pour sécuriser l'application
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limite par IP
  })
);
// Utilise le middleware pour analyser le corps des requêtes au format JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// Utilise le middleware Morgan avec le format de journal "dev" pour afficher les journaux de développement dans la console

app.use(logger("dev"));
app.use(cors({
    origin: 'http://localhost:9000', // Pas de '*', car tu utilises des headers custom
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-access-token'],
    credentials: false // Passe à true seulement si tu gères les cookies
  }));
// ✅ Optionnel mais utile pour les préflights
app.options('*', cors());
// Routes d'authentification et utilisateurs
require("./src/routes/auth.routes")(app);
require("./src/routes/role.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/log.routes")(app);
require("./src/routes/uuid.routes")(app);
require("./src/routes/cdn.routes")(app);
// Exporte l'application Express configurée
module.exports = app;
