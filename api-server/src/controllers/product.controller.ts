import { Request, response, Response } from "express";
import { dbClient } from "../config/prisma.config";
import { logger } from "../utils/reqLogger";
import { ApiError, ApiResponse } from "../config/api.config";
import { uploadImageToCloudinary } from "../utils/cloudinary.utils";
import {
  ProductDescriptionGenerationRequest,
  ProductImageGenerationRequest,
  ProductKeywordGenerationRequest,
} from "../types/types";
import { axiosInstance } from "../config/axios.config";
import { productImageGenerationQueue } from "../services/product_image_generation.queue";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    const categories = await dbClient.productCategories.findMany({
      where: { artistId: Number(artistId) },
    });

    const response = new ApiResponse(
      200,
      categories,
      "Fetched Categories Successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error fetching categories:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const error = new ApiError(400, "Product ID is required");
      return res.status(error.statusCode).json(error);
    }

    const product = await dbClient.products.findFirst({
      where: { id: Number(productId) },
      include: {
        productMedia: true,
        variants: true,
        category: true,
      },
    });

    if (!product) {
      const error = new ApiError(404, "Product not found");
      return res.status(error.statusCode).json(error);
    }

    const response = new ApiResponse(
      200,
      product,
      "Product fetched successfully"
    );
    return res.status(response.statusCode).json(response);
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error fetching product:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { professionId, artistId, categoryId } = req.query;

    const whereClause: any = {};

    if (professionId) {
      whereClause.professionId = Number(professionId);
    }
    if (artistId) {
      whereClause.artistId = Number(artistId);
    }
    if (categoryId) {
      whereClause.categoryId = Number(categoryId);
    }

    const products = await dbClient.products.findMany({
      where: whereClause,
      include: {
        productMedia: true,
        category: true,
      },
    });

    const response = new ApiResponse(
      200,
      products,
      "Products fetched successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error fetching products", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getProductsByArtistId = async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;

    const products = await dbClient.artist.findFirst({
      where: { artistId: Number(artistId) },
      include: {
        productCategories: {
          include: {
            products: {
              include: {
                productMedia: true,
              },
            },
          },
        },
      },
    });

    const response = new ApiResponse(
      200,
      products,
      "Products fetched successfully by artist id"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error fetching products by artist id", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const createNewCategory = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    const { categoryName, categoryDescription } = req.body;

    const newCategory = await dbClient.productCategories.create({
      data: {
        categoryName,
        categoryDescription,
        artist: {
          connect: { artistId: Number(artistId) },
        },
      },
    });

    const response = new ApiResponse(
      201,
      newCategory,
      "Category created successfully"
    );

    logger.info(
      `New category '${categoryName}' created for artistId: ${artistId}`
    );

    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error creating new category:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const listNewProduct = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    const categoryId = Number(req.body.categoryId);
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const productPrice = Number(req.body.productPrice);
    const availableColors = req.body.availableColors;
    const sizes = req.body.sizes;
    const dimensions = req.body.dimensions;
    const materialType = req.body.materialType;

    if (!categoryId || !productName || !productPrice) {
      const error = new ApiError(400, "Missing required fields", [
        "categoryId, productName, and productPrice are required",
      ]);
      return res.status(error.statusCode).json(error);
    }

    const category = await dbClient.productCategories.findFirst({
      where: {
        id: Number(categoryId),
        artistId: Number(artistId),
      },
    });

    if (!category) {
      const error = new ApiError(404, "Category not found", [
        "No category found for this artist",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    const product = await dbClient.products.create({
      data: {
        categoryId: Number(categoryId),
        productName,
        productDescription,
        basePrice: Number(productPrice),
      },
    });

    if (availableColors || sizes || materialType || dimensions) {
      const variants: any[] = [];

      const colors = availableColors;
      const sizeList = sizes;

      for (const color of colors) {
        for (const size of sizeList) {
          variants.push({
            productId: product.id,
            size: size || null,
            color: color || null,
            materialType: materialType || null,
            dimensions: dimensions,
            price: Number(productPrice),
            stock: 0, // default stock
          });
        }
      }

      if (variants.length > 0) {
        await dbClient.productVariant.createMany({ data: variants });
      }
    }

    const uploadedFiles = req.files as Express.Multer.File[];
    const mediaEntries: any[] = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const uploadResult = await uploadImageToCloudinary(file.buffer);

        mediaEntries.push({
          productId: product.id,
          imageUrl: uploadResult,
          mediaType: "image",
          altText: productName,
          caption: productDescription,
        });
      }

      if (mediaEntries.length > 0) {
        await dbClient.productMedia.createMany({ data: mediaEntries });
      }
    }

    const newProduct = await dbClient.products.findUnique({
      where: { id: product.id },
      include: { variants: true, productMedia: true, category: true },
    });

    const response = new ApiResponse(
      201,
      newProduct,
      "Product Listed Successfully"
    );
    logger.info(
      `New product '${productName}' created for artistId: ${artistId} under categoryId: ${categoryId}`
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error listing new product:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const generateProductDescription = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = Number(authReq.userId);

    const { productId, custom_req } = req.body;

    const productInfo = await dbClient.products.findFirst({
      where: { id: productId },
    });

    const artistProfile = await dbClient.artistProfile.findFirst({
      where: { artistId: artistId },
      include: {
        descriptions: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        profession: true,
      },
    });

    const payload: ProductDescriptionGenerationRequest = {
      location: artistProfile?.businessLocation ?? "",
      profession: artistProfile?.profession.name ?? "",
      background: artistProfile?.descriptions?.[0].backgroundInfo ?? "",
      product_name: productInfo?.productName ?? "",
      product_description: productInfo?.productDescription ?? "",
      custom_req: custom_req,
    };

    const descriptionGenerationResponse = await axiosInstance.post(
      "/api/product-manage/generate-product-description",
      payload
    );

    const { description, plain_text } = descriptionGenerationResponse.data;

    const updatedProduct = await dbClient.products.update({
      where: { id: productId },
      data: {
        generatedDescription: description,
        isDescriptionAccepted: false,
      },
    });

    const response = new ApiResponse(
      200,
      {
        product: updatedProduct,
        generatedDescription: description,
        plainText: plain_text,
      },
      "Product description generated successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error generating product description", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const acceptGeneratedProductDescription = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.body;

    const updatedProduct = await dbClient.products.update({
      where: { id: productId },
      data: {
        isDescriptionAccepted: true,
      },
    });

    const response = new ApiResponse(
      200,
      {
        product: updatedProduct,
      },
      "Product description accepted successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error accepting product description", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const generateProductProfessionalShoot = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.body;

    const productInfo = await dbClient.products.findFirst({
      where: { id: productId },
      include: { productMedia: true, category: true },
    });

    if (!productInfo) {
      const err = new ApiError(404, "Product not found", [
        "No product found with this ID",
      ]);
      return res.status(err.statusCode).json(err);
    }

    const jobs: any[] = [];

    for (const productMediaTemp of productInfo.productMedia ?? []) {
      const payload: ProductImageGenerationRequest = {
        art_form: productInfo?.category?.categoryDescription ?? "",
        product_description: productInfo?.productDescription ?? "",
        product_image_url: productMediaTemp.imageUrl,
      };

      const jobRecord = await dbClient.productImageGeneration.create({
        data: {
          productMediaId: Number(productMediaTemp.id),
          status: "PENDING",
        },
      });

      await productImageGenerationQueue.add("generate-product", {
        jobId: jobRecord.id,
        productMediaId: productMediaTemp.id,
        payload,
      });

      jobs.push(jobRecord);
    }

    const response = new ApiResponse(
      200,
      { jobs },
      "Product professional shoot jobs queued successfully"
    );

    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error generating product shoot", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getProductImageGenerationStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = req.params;

    const jobStatus = await dbClient.productImageGeneration.findFirst({
      where: { id: Number(jobId) },
    });

    const response = new ApiResponse(
      200,
      jobStatus,
      "Status Fetched Successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error generating product shoot", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const generateProductKeywords = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    const { productId } = req.body;

    const artitstInfo = await dbClient.artistProfile.findFirst({
      where: { artistId: Number(artistId) },
      include: { profession: true },
    });

    const productInfo = await dbClient.products.findFirst({
      where: { id: productId },
      include: { category: true },
    });

    const payload: ProductKeywordGenerationRequest = {
      profession: artitstInfo?.profession.description ?? "",
      product_name: productInfo?.productDescription ?? "",
      product_description: productInfo?.productDescription ?? "",
      location: artitstInfo?.businessLocation ?? "",
      artist_name: artitstInfo?.businessName ?? "",
    };

    const keywordResponse = await axiosInstance.post(
      "/api/product-manage/generate-product-keywords",
      payload
    );

    const { keywords } = keywordResponse.data;

    const updatedProduct = await dbClient.products.update({
      where: { id: productId },
      data: {
        keywords: keywords,
      },
    });

    const response = new ApiResponse(
      200,
      updatedProduct,
      "Product Keywords Generated Successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error generating keywords", error);
    return;
  }
};
