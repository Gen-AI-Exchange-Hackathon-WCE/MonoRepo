from fastapi import APIRouter
from app.models.product_schema import ProductProfessionalShootGenerationRequest, ProductProfessionalShootGenerationResponse, ProductKeywordGenerationRequest, ProductKeywordGenerationResponse, ProductDescriptionGenerationRequest, ProductDescriptionGenerationResponse
from app.services.product_professional_shoot_generator import generate_professional_photo_shoot
from app.services.product_keyword_generator import generate_keyword_for_product
from app.services.product_description_generator import generate_description_for_product
from app.services.description_generator import convert_markdown_to_text

router = APIRouter(tags=["product_manage"])


@router.post("/generate-professional-shoot")
async def generate_professional_shoot(request: ProductProfessionalShootGenerationRequest) -> ProductProfessionalShootGenerationResponse:
    generated_product_image_url = generate_professional_photo_shoot(request)
    return ProductProfessionalShootGenerationResponse(generated_product_image_url=generated_product_image_url)

@router.post("/generate-product-keywords")
def generate_product_keywords(request: ProductKeywordGenerationRequest) -> ProductKeywordGenerationResponse:
    hashtags = generate_keyword_for_product(request)
    return ProductKeywordGenerationResponse(keywords=hashtags)

@router.post("/generate-product-description")
def generate_product_description(request: ProductDescriptionGenerationRequest) -> ProductDescriptionGenerationResponse:
    product_description = generate_description_for_product(request)
    plain_text = convert_markdown_to_text(product_description)
    return ProductDescriptionGenerationResponse(description=product_description, plain_text=plain_text)