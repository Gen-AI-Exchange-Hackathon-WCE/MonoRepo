from pydantic import BaseModel
from typing import Optional, List


class DescriptionGenerationRequest(BaseModel):
    profession: str
    location: str
    background: str | None = None
    experience: str | None = None
    custom_request: str | None = None
    previous_descriptions: List[str] | None = None


class DescriptionGenerationResponse(BaseModel):
    description: str
    plain_text: str


class ProfileBackgroundRequest(BaseModel):
    profession: str
    location: str
    background: str | None = None
    experience: str | None = None
    description: str | None = None
    custom_request: str | None = None

class ProfileBackgroundResponse(BaseModel):
    background_url: str
