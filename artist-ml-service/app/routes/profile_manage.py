from fastapi import APIRouter
from app.models.profile_schema import DescriptionGenerationRequest, DescriptionGenerationResponse, ProfileBackgroundRequest, ProfileBackgroundResponse
from app.services.description_generator import generate_profile_desc_service, convert_markdown_to_text
from app.services.background_image_generator import generate_background_image_service

router = APIRouter(tags=["profile_manage"])


@router.post("/generate-description")
def generate_description(request: DescriptionGenerationRequest) -> DescriptionGenerationResponse:
    description = generate_profile_desc_service(
        profession=request.profession,
        location=request.location,
        background=request.background,
        experience=request.experience
    )
    plain_text_description = convert_markdown_to_text(description)
    return DescriptionGenerationResponse(description=description, plain_text=plain_text_description)


@router.post("/get-profile-background")
def generate_profile_background(request: ProfileBackgroundRequest) -> ProfileBackgroundResponse:
    # TODO: Add logic to retrieve profile background based on the artist name
    background_image_url = generate_background_image_service(
        request
    )
    return ProfileBackgroundResponse(background_url=background_image_url)