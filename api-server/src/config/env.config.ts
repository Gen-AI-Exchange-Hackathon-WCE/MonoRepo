import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  LOGGING: number;
  JWT_SECRET: string;
  NODE_ENV: string;
  CLOUD_NAME_CLOUDINARY: string;
  API_KEY_CLOUDINARY: string;
  API_SECRET_CLOUDINARY: string;
  ARTIST_ML_SERVICE_URL: string;
  CORS_ORIGIN: string;
  REDIS_ENDPOINT: string;
  REDIS_PORT: string;
}

const getEnvVariable = (key: keyof EnvConfig): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

const envConfig: EnvConfig = {
  PORT: getEnvVariable("PORT"),
  LOGGING: Number(getEnvVariable("LOGGING")),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  CLOUD_NAME_CLOUDINARY: getEnvVariable("CLOUD_NAME_CLOUDINARY"),
  API_KEY_CLOUDINARY: getEnvVariable("API_KEY_CLOUDINARY"),
  API_SECRET_CLOUDINARY: getEnvVariable("API_SECRET_CLOUDINARY"),
  ARTIST_ML_SERVICE_URL: getEnvVariable("ARTIST_ML_SERVICE_URL"),
  CORS_ORIGIN: getEnvVariable("CORS_ORIGIN"),
  REDIS_ENDPOINT: getEnvVariable("REDIS_ENDPOINT"),
  REDIS_PORT: getEnvVariable("REDIS_PORT"),
};

export default envConfig;
