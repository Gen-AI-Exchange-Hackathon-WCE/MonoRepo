from app.utils.prompt_generator import generate_art_prompt
from app.utils.genai_client import get_genai_client
from app.models.product_schema import ProductProfessionalShootGenerationRequest
from app.constants import GCP_SHOOT_GENERATION_MODEL
from app.utils.cloudinary_uploader import upload_public_image
from google.genai.types import GenerateContentConfig, Modality, Image as GenAIImage
from PIL import Image
from io import BytesIO
import os
import requests


def generate_professional_photo_shoot(request: ProductProfessionalShootGenerationRequest) -> str:
    product_url = request.product_image_url
    prompt = generate_art_prompt(
        art_form=request.art_form, product_description=request.product_description
    )

    response = requests.get(product_url, stream=True)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content))

    genai_client = get_genai_client()

    response = genai_client.models.generate_content(
        model=GCP_SHOOT_GENERATION_MODEL,
        contents=[image, prompt],
        config=GenerateContentConfig(
            response_modalities=[Modality.TEXT, Modality.IMAGE]
        ),
    )

    filename = "generated_professional_image.png"
    file_path = os.path.join("public", filename)
    os.makedirs("public", exist_ok=True)

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            output_image = Image.open(BytesIO(part.inline_data.data))
            output_image.save(file_path)
            output_image.show()
        elif part.text:
            print(part.text)

    generated_product_image_url = upload_public_image(filename)

    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted local file: {file_path}")
    except Exception as e:
        print(f"Error deleting file: {e}")

    return generated_product_image_url
