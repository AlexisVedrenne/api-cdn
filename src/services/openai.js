const config = require("../config/aikey.config");
const logs = require("./log");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: config.openaiApiKey });

async function embbed(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 768,
    });
    const embedding = response.data[0].embedding;
    const vector = `[${embedding.join(", ")}]`;
    return vector;
  } catch (e) {
    logs.createErrorSysteme("Impossible de faire l'embedding", "embed");
    throw e;
  }
}

const systemPrompt = `
Tu joues le rôle d’un assistant qui transforme des données structurées d'une recette (en JSON) en un texte descriptif long, riche sémantiquement, et optimisé pour les recherches vectorielles. 
Ce texte doit contenir des détails concrets sur :

- Le nom du plat
- La description globale
- Le type de plat (entrée, plat, dessert…)
- Le nombre de personnes
- La durée totale (préparation + cuisson)
- Les ingrédients (quantités + unités + type)
- Les étapes principales de préparation (avec actions et ingrédients mentionnés)
- Les régimes ou préférences alimentaires (ex: chaud, végétarien, etc.)

Le texte doit tout reformuler de manière fluide et naturelle, ne pas reprendre la structure JSON, et ne pas faire de liste à puces. Il doit paraître écrit par un humain expert en cuisine.

Il doit contenir tous les éléments du JSON dans une seule description textuelle continue, sans sauter d’informations, pour permettre une recherche vectorielle riche.
`;

async function generateRecipeText(recipe) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(recipe) },
      ],
    });
    return response.choices[0].message.content;
  } catch (e) {
    logs.createErrorSysteme(
      "Impossible de générer le texte de la recette",
      "generateRecipeText"
    );
    throw e;
  }
}

const ai = {
  generateRecipeText: generateRecipeText,
  embbed: embbed,
};

module.exports = ai;
