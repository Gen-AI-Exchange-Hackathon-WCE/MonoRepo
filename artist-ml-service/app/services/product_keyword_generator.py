from app.utils.genai_client import get_genai_client
from app.models.product_schema import ProductKeywordGenerationRequest
import os
from typing import List
import requests

def generate_keyword_for_product(request: ProductKeywordGenerationRequest) -> List[str]:

    genai_client = get_genai_client()
    """
    Generate artisan-focused Instagram/Tumblr style hashtags using Gemini API.
    """
    # Build prompt for Gemini
    prompt = f"""
    Generate Instagram/Tumblr style hashtags for artisan marketing.
    Profession: {request.profession}
    Product: {request.product_name}
    Artist: {request.artist_name}
    Location: {request.location}

    Rules:
    - Prefix every keyword with '#'
    - No spaces, only lowercase
    - Make them catchy, aesthetic, and social-media friendly
    - Include product-specific, artist branding, and location-based hashtags
    - Return only the hashtags separated by spaces
    """

    # Call Gemini model
    response = genai_client.models.generate_content(
        model="gemini-1.5-flash", 
        contents=prompt
    )

    # Extract hashtags text
    hashtags_text = response.text.strip()

    # Convert to list
    hashtags = hashtags_text.split()

    return hashtags
