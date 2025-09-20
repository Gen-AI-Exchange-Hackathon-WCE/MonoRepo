import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from app.constants import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name = CLOUDINARY_CLOUD_NAME,
    api_key = CLOUDINARY_API_KEY,   
    api_secret = CLOUDINARY_API_SECRET
)  

def upload_public_image(filename: str) -> str:
    """
    Upload an image from the public folder to Cloudinary 
    and return its secure URL.
    """
    try:
        file_path = os.path.join("public", filename)
        response = cloudinary.uploader.upload(file_path, resource_type="image")
        return response["secure_url"]
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        return ""


