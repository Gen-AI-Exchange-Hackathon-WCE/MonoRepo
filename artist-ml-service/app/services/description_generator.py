from app.constants import GEMINI_AI_STUDIO_API_KEY, PROFILE_GENERATION_ENDPOINT
import requests
import json
import markdown2
from bs4 import BeautifulSoup

def generate_profile_desc_service(profession, location, background, experience):
    url = PROFILE_GENERATION_ENDPOINT

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_AI_STUDIO_API_KEY
    }

    prompt = f"""
Create a professional and engaging profile description for an artisan. The artisan's details are:
- Profession: {profession}
- Location: {location}
- Background: {background}
- Experience: {experience}

Make it appealing for an AI marketplace where customers look for unique and authentic crafts.
Format the output using markdown.
"""

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt.strip()
                    }
                ]
            }
        ]
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        result = response.json()
        description = result['candidates'][0]['content']['parts'][0]['text']
        return description
    else:
        print("Error:", response.status_code, response.text)
        return None
    

def convert_markdown_to_text(markdown_content):
    # Convert markdown to HTML
    html_content = markdown2.markdown(markdown_content)
    # Parse HTML and get plain text
    soup = BeautifulSoup(html_content, features="html.parser")
    text = soup.get_text()
    return text