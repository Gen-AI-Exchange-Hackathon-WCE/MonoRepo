from app.utils.genai_client import get_genai_client
from app.models.product_schema import ProductKeywordGenerationRequest
import os
from typing import List
import requests

def generate_description_for_product(request: ProductKeywordGenerationRequest) -> str:

    genai_client = get_genai_client()
    """
    Generate an artisan-focused product description in Markdown format using Gemini API.
    """
    prompt = f"""
    Write a **Markdown formatted** product description for marketing.

    Product: {request.product_name}
    Profession: {request.profession}
    Location: {request.location}
    Background/Story: {request.background}
    Given Description: {request.product_description}
    Custom Request: {request.custom_req if request.custom_req else ""}

    Guidelines:
    - Use a heading for the product name
    - Use italics/bold for emphasis where needed
    - Write 3–4 sentences highlighting craftsmanship, uniqueness, and cultural value
    - Make it aesthetic and suitable for online stores, blogs, or social media
    """

    response = genai_client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )

    return response.text.strip()