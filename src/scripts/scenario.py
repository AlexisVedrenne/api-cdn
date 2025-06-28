from openai import OpenAI
import json
import sys

# Clé API (pense à sécuriser dans un .env ou autre)


def create_prompt(trends,style="absurde",nbScene=3):
    prompt = (
    f"Tu es un créateur de contenu TikTok spécialisé dans les vidéos ultra-virales. "
    f"Génére une **mini-histoire captivante** dans un style {style}, découpée en au moins {nbScene} scènes. "
    f"Ton objectif est d'accrocher l'utilisateur dans les **3 premières secondes**, dès la première scène. "
    "Utilise une accroche visuelle ou une situation absurde, choquante ou intrigante pour commencer. "
    "L’histoire doit évoluer rapidement avec une montée en tension et une résolution inattendue ou drôle. "
    "Chaque scène doit suivre logiquement la précédente pour former une narration courte mais **hautement addictive**. "
    "Ajoute à chaque scène des **éléments visuels forts** (lieux, objets, actions) et des personnages distinctifs."
    "À la fin, ajoute un appel à l'action incitant à commenter, liker ou proposer la suite. "
    "Retourne uniquement un JSON structuré dans ce format précis :\n\n"
    "{\n"
    "  \"scenes\": [\n"
    "    {\n"
    "      \"description\": \"Phrase décrivant la scène\",\n"
    "      \"characters\": [\"Nom, description physique\"],\n"
    "      \"location\": \"Lieu de la scène (visuel et concret)\",\n"
    "      \"actions\": [\"Action 1\", \"Action 2 (dynamiques ou absurdes)\"],\n"
    "      \"objects\": [\"Objet marquant ou utile à la scène\"],\n"
    "      \"hashtags\": [\"#hashtag\"],\n"
    "      \"style\": \"Style de la scène (réaliste, cartoon, dramatique, etc.)\"\n"
    "    },\n"
    "    ...\n"
    "  ],\n"
    "  \"voice_over\": \"Narration finale punchy ou ironique\",\n"
    "  \"call_to_action\": \"Ex: ‘Commente un mot pour créer la suite !’\",\n"
    "  \"title\": \"Titre court et intrigant, comme une vidéo YouTube (max 10 mots)\",\n"
    "  \"hashtags\": [\"#hashtag\"]\n"
    "}\n\n"
    "Décris les personnages de façon concise mais visuelle. Chaque scène doit être un **événement visuel**. "
    f"Utilise impérativement ce format. Ne renvoie **que** le JSON.\n\n"
    f"Inspire-toi fortement des tendances suivantes :\n"
    f"- Tendances : {trends[:15]}\n"
)

    return prompt

def generate(apiKey,trends,style="absurde",nbScene=3):
    client = OpenAI(api_key=apiKey)
    prompt = create_prompt(trends,style,nbScene)
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"Tu es un scénariste de vidéos TikTok. Tu dois inventer des histoires très courtes, dans un style {style}, à partir de tendances données."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.8,
    )
    try:
        story_json = json.loads(response.choices[0].message.content.strip())
    except json.JSONDecodeError as e:
        print("Erreur de parsing JSON :", e)
        story_json = {"error": "Invalid JSON", "raw": response.choices[0].message.content.strip()}
    return {"story": story_json}


print(json.dumps(generate(json.loads(sys.argv[1]), json.loads(sys.argv[2]),json.loads(sys.argv[3]),json.loads(sys.argv[4]))))