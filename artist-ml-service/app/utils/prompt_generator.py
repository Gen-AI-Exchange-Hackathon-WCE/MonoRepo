from app.models.profile_schema import ProfileBackgroundRequest


def build_background_prompt(request: ProfileBackgroundRequest) -> str:
    """
    Build a descriptive prompt for background image generation 
    based on profile details.
    """
    prompt_parts = []

    # Profession and location are primary
    if request.profession:
        prompt_parts.append(f"A professional {request.profession}")
    if request.location:
        prompt_parts.append(f"set in {request.location}")

    # Background context
    if request.background:
        prompt_parts.append(f"with a {request.background} background")

    # Experience
    if request.experience:
        prompt_parts.append(f"showcasing {request.experience} of experience")

    # Description
    if request.description:
        prompt_parts.append(f"depicting {request.description}")

    # Custom request overrides or adds
    if request.custom_request:
        prompt_parts.append(f"{request.custom_request}")

    # Join everything into a single prompt
    prompt = ", ".join(prompt_parts)

    # Default fallback if prompt is empty
    if not prompt:
        prompt = "A professional background image"

    return prompt


def generate_art_prompt(art_form: str, product_description: str) -> str:
    return (
        f"Transform this {art_form} into a professional studio photograph. "
        f"The piece is {product_description}. "
        f"Keep the {art_form} fully intact and realistic. Place it on a subtle, elegant surface "
        f"with complementary props, such as minimal decorative items that enhance the scene "
        f"without distracting from the {art_form}. Apply soft, natural lighting to highlight textures and colors. "
        f"Use a clean, uncluttered, and aesthetically pleasing background, such as a light gradient or soft neutral tones. "
        f"Enhance colors, contrast, and details to make the {art_form} look high-quality and visually appealing, "
        f"like a professional product photo."
    )
