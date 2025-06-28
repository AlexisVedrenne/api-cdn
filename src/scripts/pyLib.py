from pathlib import Path
import textwrap
import math
import unicodedata
import re
import ffmpeg
import httpx

def get_audio_duration(audio_path: str) -> float:
    """
    Récupère la durée en secondes d’un fichier audio.
    """
    probe = ffmpeg.probe(audio_path)
    duration = float(probe['format']['duration'])
    return duration

def sanitize_ffmpeg_text(text):
    # Apostrophes typographiques + échappement des caractères spéciaux
    text = text.replace("'", "ʼ")
    text = text.replace('"', r'\"')         # guillemets doubles
    text = text.replace(',', r'\,')         # virgules
    text = text.replace(':', r'\:')         # deux-points
    text = re.sub(r'[\r\n]', '', text)      # retire les sauts de ligne
    return text

def normalize_text(text: str) -> str:
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')

def get_scene_path(script_id: str, scene_id: int) -> Path:
    documents_dir = Path.home() / "Documents" / "video_ai" / script_id / f"scene_{scene_id}"
    documents_dir.mkdir(parents=True, exist_ok=True)
    return documents_dir

def get_outro_path(script_id: str) -> Path:
    documents_dir = Path.home() / "Documents" / "video_ai" / script_id / "scene_ending" / "outro.mp4"
    return documents_dir

def get_image_history_path(imageName: str) -> Path:
    # Dossier cible
    base_dir = Path.home() / "Documents" / "video_ai" / "image_history"
    base_dir.mkdir(parents=True, exist_ok=True)
    # Chemin complet du fichier image
    return base_dir / imageName

def wrap_text(text: str, line_width: int = 30):
    return "\n".join(textwrap.wrap(text, width=line_width))

def estimate_words_per_segment(text: str, audio_duration: float, target_segment_duration: float = 1.1) -> int:
    total_words = len(text.split())
    total_segments = max(1, round(audio_duration / target_segment_duration))
    words_per_segment = max(1, round(total_words / total_segments))
    return total_segments

def generate_approx_segments(text: str, audio_duration: float, num_segments: int = 3, padding: float = 0.3):
    """
    Découpe un texte en segments approximatifs synchronisés avec la durée audio.
    
    :param text: Texte complet à afficher
    :param audio_duration: Durée totale de l'audio
    :param num_segments: Nombre de morceaux à créer
    :param padding: Délai avant le début (évite que le texte apparaisse trop tôt)
    :return: Liste de segments [{'text': ..., 'start': ..., 'end': ...}]
    """

    words = text.strip().split()
    words_per_segment = math.ceil(len(words) / num_segments)
    
    segments_text = [
        " ".join(words[i:i + words_per_segment])
        for i in range(0, len(words), words_per_segment)
    ]
    
    total_chars = sum(len(s) for s in segments_text)
    available_duration = max(audio_duration - padding, 0.5)
    
    current_start = padding
    segments = []
    
    for seg in segments_text:
        seg_duration = (len(seg) / total_chars) * available_duration
        start = round(current_start, 2)
        end = round(start + seg_duration, 2)
        segments.append({
            "text": seg,
            "start": start,
            "end": end
        })
        current_start = end

    return segments

def saveImg(image_url,output_path):
    img_data = httpx.get(image_url).content
    with open(output_path, "wb") as f:
            f.write(img_data)
            
def getFontPath(fontName):
    project_name = "api-historia"
    current_dir = Path(__file__).resolve().parent
    for parent in current_dir.parents:
        if parent.name == project_name:
            font_path = parent / "src" / "assets" / "fonts" / fontName
            # Supprime "C:" ou "D:" ou autre drive Windows
            return font_path.resolve().as_posix().removeprefix(f"{Path(font_path.anchor).as_posix()}")
    raise FileNotFoundError(f"Le dossier {project_name} n'a pas été trouvé dans la hiérarchie.")