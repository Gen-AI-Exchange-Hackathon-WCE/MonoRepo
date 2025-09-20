from google.genai import client
from app.constants import GEMINI_GCP_API_KEY

def get_genai_client():
    return client.Client(api_key=GEMINI_GCP_API_KEY)