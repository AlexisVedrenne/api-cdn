import os
import asyncio
import openai
import json
import sys
from scripts.pyLib import *
import uuid

# Clés API
openai.api_key = json.loads(sys.argv[1])


def generate_image(prompt: str, output_path: str):
    try:
        response = openai.images.generate(
            model="dall-e-3",
            prompt=f"{prompt}",
            size="1024x1792",
            quality="hd",
            n=1
        )
        image_url = response.data[0].url
        saveImg(image_url,output_path)
        return { "image_url" : image_url ,"prompt":prompt,"image_name":"" }
    except Exception as e:
        print("Erreur",e)

def generate_image_prompt(scene: dict) -> str:
    system_prompt = """
You are an assistant specialized in generating concise and vivid descriptions for image generation models like DALL·E, Stable Diffusion, or Sora. Given a scene described in JSON format, your goal is to produce a cinematic, visually rich English prompt that is focused, compatible with model constraints, and aligned with the specified "style" field (e.g., realistic, stylized, absurd).

Your objective is to:

- Describe the scene clearly, visually, and compactly (target ~600–800 characters).
- Focus on what can be visually rendered: physical settings, objects, characters, actions, and lighting.
- Briefly place the characters in the scene, including simple actions and visible expressions.
- Integrate the described elements logically and vividly, without inner thoughts or emotional states.
- Use visual composition terms like “soft glow”, “wide shot”, “foggy forest”, “golden hour lighting”, etc.
- Avoid hashtags, metadata, technical directives, or speculative storytelling.
- Do not use sensitive terms (e.g. war, blood, injury, soldier) that could trigger moderation issues.

End the prompt with fitting visual keywords, such as:
“bold graphic style, soft warm lighting, wide framing, 16:9 aspect ratio”
(or others depending on the intended style).
"""
    user_prompt = json.dumps({
        "description": scene["description"],
        "characters": scene["characters"],
        "location": scene["location"],
        "actions": scene["actions"],
        "objects": scene["objects"],
        "style": scene["style"]
    })

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.8
    )
    return response.choices[0].message.content.strip()

async def main(scene):
    prompt = generate_image_prompt(scene)
    scene_path = get_scene_path(f"scenario_{scene['scenarioId']}", scene["id"])
    image_path = os.path.join(scene_path, "image.png")
    json  = await asyncio.to_thread(generate_image, prompt=prompt, output_path=image_path)
    uid = uuid.uuid4()
    imageName = f"scenario_{scene['scenarioId']}_{scene['id']}_{uid}.png"
    historyPath = get_image_history_path(imageName)
    saveImg(json["image_url"],historyPath)
    json["image_name"]=imageName
    return json


if __name__ == "__main__":
    scene = json.loads(sys.argv[2])  # Lecture de l'argument JSON
    result = asyncio.run(main(scene))  # Attend l'exécution de main()
    print(json.dumps(result)) 
