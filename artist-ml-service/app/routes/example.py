from fastapi import APIRouter

router = APIRouter(tags=["example"])


@router.get("/health")
async def health_check():
    return {"status": "ok"}
