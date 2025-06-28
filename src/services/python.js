const { spawn } = require("child_process");
const { execSync } = require("child_process");
const logs = require("./log");

async function runPython(pythonScript, params) {
  try {
    const pythonPath = execSync("pyenv which python").toString().trim();

    // Utiliser une promesse pour gérer la sortie de spawn
    const jsonData = await new Promise((resolve, reject) => {
      let args = [`src/scripts/${pythonScript}.py`];
      for (const param of params) {
        args.push(JSON.stringify(param));
      }
      const pythonProcess = spawn(pythonPath, args);
      let outputData = "";

      const jsonRegex = /^\s*[\[{].*[\]}]\s*$/s;

      pythonProcess.stdout.on("data", (data) => {
        const text = data.toString();
        if (jsonRegex.test(text.trim())) {
          outputData += text;
        } else {
          console.log(text);
        }
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Erreur : ${data}`);
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            // Essayer de parser la sortie en JSON et la renvoyer
            const parsedData = JSON.parse(outputData ? outputData : "{}");
            resolve(parsedData); // Résoudre la promesse avec les données JSON
          } catch (error) {
            logs.createErrorSysteme(
              "Impossible de faire le parsing du JSON",
              "runPython"
            );
            reject(error); // Rejeter la promesse en cas d'erreur de parsing
          }
        } else {
          logs.createErrorSysteme(
            `Le processus Python s'est terminé avec le code ${code}`
          );
          reject(
            new Error(
              `Le processus Python s'est terminé avec le code ${code}`,
              "getDocJson"
            )
          ); // Rejeter la promesse en cas d'erreur
        }
      });
    });
    return jsonData;
  } catch (e) {
    const message = `Impossible d'exécuter le script python ${pythonScript}. Détail : ${e.message}`;
    logs.createErrorSysteme(message, "runPython");
    throw e;
  }
}

const python = {
  runPython: runPython,
};

module.exports = python;
