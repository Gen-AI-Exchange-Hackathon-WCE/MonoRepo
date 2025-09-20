from app.utils.prompt_generator import build_background_prompt
from google.genai import types
from app.models.profile_schema import ProfileBackgroundRequest
from app.utils.genai_client import get_genai_client
from app.constants import GCP_IMAGE_GENERATION_MODEL
from app.utils.cloudinary_uploader import upload_public_image
import os


def generate_background_image_service(request: ProfileBackgroundRequest) -> str:
    """
    Generate a background image based on profile details,
    upload it to Cloudinary, delete local file, and return Cloudinary URL.
    """
    prompt = build_background_prompt(request)
    print("Generated Prompt:", prompt)

    # Initialize Google GenAI client
    genai_client = get_genai_client()

    # Generate image
    response = genai_client.models.generate_images(
        model=GCP_IMAGE_GENERATION_MODEL,
        prompt=prompt,
        config=types.GenerateImagesConfig(
            number_of_images=1,
            include_rai_reason=True,
            output_mime_type='image/jpeg',
            aspect_ratio='16:9',
        ),
    )

    # Save to public folder
    filename = "generated_image.jpg"
    file_path = os.path.join("public", filename)
    image = response.generated_images[0].image
    image.save(file_path)
    print(f"Image saved as {file_path}")

    # Upload to Cloudinary
    background_image_url = upload_public_image(filename)

    # Delete local file after upload
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted local file: {file_path}")
    except Exception as e:
        print(f"Error deleting file: {e}")

    # ✅ Always return Cloudinary URL
    return background_image_url
