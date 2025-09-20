from fastapi import FastAPI
from app.routes import example, profile_manage, product_manage

app = FastAPI(title="Artist_ML_Service",
              description="A service for artist activity management", version="1.0.0")
app.include_router(example.router, prefix="/api", tags=["example"])
app.include_router(profile_manage.router, prefix="/api/profile-manage",
                   tags=["profile_manage"])
app.include_router(product_manage.router,
                   prefix="/api/product-manage", tags=["product_manage"])
