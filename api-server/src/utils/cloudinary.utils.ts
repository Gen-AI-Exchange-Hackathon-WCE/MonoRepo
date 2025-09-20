import cloudinary from "../config/cloudinary.config";
import { logger } from "./reqLogger";

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
}

export const uploadImageToCloudinary = async (
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<string | null> => {
  try {
    const result = await new Promise<{ secure_url?: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: options.folder ?? "uploads",
              public_id: options.public_id,
              overwrite: options.overwrite ?? false,
              resource_type: "image",
            },
            (error, uploadResult) => {
              if (error) {
                reject(error);
              } else {
                resolve(uploadResult as { secure_url?: string });
              }
            }
          )
          .end(buffer);
      }
    );

    return result.secure_url ?? null;
  } catch (err: any) {
    logger.error("Error uploading image:", err);
    return null;
  }
};

export const uploadVideoToCloudinary = async (
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<string | null> => {
  try {
    const result = await new Promise<{ secure_url?: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: options.folder ?? "uploads",
              public_id: options.public_id,
              overwrite: options.overwrite ?? false,
              resource_type: "video",
            },
            (error, uploadResult) => {
              if (error) {
                reject(error);
              } else {
                resolve(uploadResult as { secure_url?: string });
              }
            }
          )
          .end(buffer);
      }
    );

    return result.secure_url ?? null;
  } catch (err: any) {
    logger.error("Error uploading video:", err);
    return null;
  }
};
