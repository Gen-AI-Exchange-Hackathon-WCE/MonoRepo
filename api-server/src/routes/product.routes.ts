import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../utils/reqLogger";
import { validateRequest } from "../middlewares/reqValidate.middleware";
import {
  createNewCategorySchema,
  listNewProductSchema,
  getProductSchema,
  parseProductFormData,
  generateProductDescriptionSchema,
  acceptProductDescriptionSchema,
  getProductMediaGenerationStatusSchema,
  generateProductShootSchema,
  generateProductKeywordsSchema,
  getProductByArtistIdSchema,
} from "../models/product.models";
import {
  getProduct,
  createNewCategory,
  listNewProduct,
  getCategories,
  getProducts,
  generateProductDescription,
  acceptGeneratedProductDescription,
  generateProductProfessionalShoot,
  getProductImageGenerationStatus,
  generateProductKeywords,
  getProductsByArtistId,
} from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

const uploadFields = upload.array("productImages");

router.get(
  "/categories",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/categories Hit");
    next();
  },
  getCategories
);

router.get(
  "/products",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/products Hit");
    next();
  },
  getProducts
);

router.get(
  "/artist-product/:artistId",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/artist-product/:artistId Hit");
    next();
  },
  validateRequest(getProductByArtistIdSchema),
  getProductsByArtistId
);

router.get(
  "/:productId",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/:productId Hit");
    next();
  },
  validateRequest(getProductSchema),
  getProduct
);

router.post(
  "/new-category",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/new-category Hit");
    next();
  },
  validateRequest(createNewCategorySchema),
  createNewCategory
);

router.post(
  "/new-product",
  uploadFields,
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/new-product Hit");
    next();
  },
  parseProductFormData,
  validateRequest(listNewProductSchema),
  listNewProduct
);

router.post(
  "/generate-product-desc",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/generate-product-desc Hit");
    next();
  },
  validateRequest(generateProductDescriptionSchema),
  generateProductDescription
);

router.post(
  "/accept-product-desc",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/accept-product-desc Hit");
    next();
  },
  validateRequest(acceptProductDescriptionSchema),
  acceptGeneratedProductDescription
);

router.post(
  "/generate-product-shoot",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/generate-product-shoot Hit");
    next();
  },
  validateRequest(generateProductShootSchema),
  generateProductProfessionalShoot
);

router.get(
  "/image-generation-status/:jobId",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/image-generation-status Hit");
    next();
  },
  validateRequest(getProductMediaGenerationStatusSchema),
  getProductImageGenerationStatus
);

router.post(
  "/generate-product-keywords",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/product/generate-product-keywords Hit");
    next();
  },
  validateRequest(generateProductKeywordsSchema),
  generateProductKeywords
);

export default router;
