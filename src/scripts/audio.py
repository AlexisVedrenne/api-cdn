import os
import asyncio
import httpx
import aiofiles
import json
import sys
from scripts.pyLib import *

# Clés API
eleven_api_key = json.loads(sys.argv[1])

async def generate_voiceover(
    text: str,
    output_path: str,
    api_key: str,
    voice_id: str = "aQROLel5sQbj1vuIVi6B",
    model_id: str = "eleven_multilingual_v2",
    stability: float = 0.5,
    similarity_boost: float = 0.7
):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, content=json.dumps(payload))
        if response.status_code != 200:
            raise Exception(f"Erreur ElevenLabs: {response.status_code} - {response.text}")
        async with aiofiles.open(output_path, "wb") as f:
            await f.write(response.content)
    return output_path

async def main(scene,voiceover = None,config=None):
    scene_path = get_scene_path(f"scenario_{scene['scenarioId']}", scene["id"])
    audio_path =  os.path.join(scene_path, "audio.mp3")
    description = f"{scene['description']}.{voiceover} " if voiceover else scene["description"]
    await generate_voiceover(text=description, output_path=audio_path, api_key=eleven_api_key,voice_id=config["voice"])
if __name__ == "__main__":
    asyncio.run(main(json.loads(sys.argv[2]),json.loads(sys.argv[3])if len(sys.argv) > 3 else None,json.loads(sys.argv[4])))
