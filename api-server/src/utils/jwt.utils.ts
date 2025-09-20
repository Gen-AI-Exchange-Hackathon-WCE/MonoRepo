import jwt, { SignOptions, Secret } from "jsonwebtoken";
import envConfig from "../config/env.config";

const JWT_SECRET: Secret = envConfig.JWT_SECRET;

export const signToken = (
  payload: string | object | Buffer,
  expiresIn: string | number = "7d"
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
