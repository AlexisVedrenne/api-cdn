const fs = require("fs");
const path = require("path");
const baseCheminTemplate = "/assets/templates";
const db = require("../models");
const logs = require("./log");

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function importTemplate(nomTemplate, params) {
  const templatePath = path.join(
    __dirname,
    `../${baseCheminTemplate}/${nomTemplate}`
  );
  const template = fs.readFileSync(templatePath, "utf8");
  return renderTemplate(template, params);
}

function renderTemplate(template, params) {
  return template.replace(/{{(.*?)}}/g, (match, p1) => {
    return params[p1] || "";
  });
}

async function addEmbed(tableName, embedding, id) {
  try {
    await db.sequelize.query(
      `UPDATE "${tableName}"
       SET embedding = '${embedding}'::vector
       WHERE id = ${id};`,
      {
        type: db.sequelize.QueryTypes.UPDATE,
      }
    );

  } catch (e) {
    console.log(e)
    logs.createErrorSysteme("Impossible d'ajouter l'embedding", "addEmbed");
    throw e;
  }
}

const systemeService = {
  delay: delay,
  importTemplate: importTemplate,
  addEmbed: addEmbed,
};

module.exports = systemeService;
