from pydantic import BaseModel
from typing import Optional, List


class ProductProfessionalShootGenerationRequest(BaseModel):
    art_form: str
    product_image_url: str
    product_description: str | None = None


class ProductProfessionalShootGenerationResponse(BaseModel):
    generated_product_image_url: str


class ProductKeywordGenerationRequest(BaseModel):
    profession: str
    product_name: str
    location: str
    artist_name: str


class ProductKeywordGenerationResponse(BaseModel):
    keywords: List[str]


class ProductDescriptionGenerationRequest(BaseModel):
    profession: str
    product_name: str
    product_description: str
    custom_req: str | None = None
    location: str
    background: str


class ProductDescriptionGenerationResponse(BaseModel):
    description: str
    plain_text: str
