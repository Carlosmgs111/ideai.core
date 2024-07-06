// import { createToken, verifyToken2 } from "../../infrastructure/auth/JWT";
import { expiresIn1Month, expiresIn2H, expiresIn15Minutes } from "./expires";
import config from "../../config";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { signin } from "../../modules/shared/auth/use_cases";

export const createToken = (
  params: any,
  expiresIn: number | string = expiresIn1Month,
  secret = config.jwtAccessSecret
) => {
  return jwt.sign({ sub: params._id || params.sub, ...params }, secret || "", {
    expiresIn,
  });
};

export const verifyToken = (
  token: any,
  signature: any = config.jwtSignupSecret
) => {
  try {
    const payload: any = jwt.verify(token, signature);
    if (!payload) throw new Error("Invalid Payload!");
    return payload;
  } catch (e) {
    e;
    throw new Error("Invalid Token!");
  }
};

export const verifyToken2 = async (
  token: any,
  signature: any = config.jwtAccessSecret
) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(signature)
    );
    const { uuid, email, username } = verified.payload;
    console.log({ uuid, email, username });
    return {
      user: await signin({
        uuid,
        email,
        username,
      }),
    };
  } catch (e: any) {
    throw new Error("Invalid token");
  }
};

export const extractFromToken = async (
  token: any,
  signature: any = config.jwtAccessSecret
) => {
  return (await jwtVerify(token, new TextEncoder().encode(signature))).payload;
};

export class AuthServices {
  constructor() {}

  createShortTimeKey = (payload: any) => {
    return createToken(payload, expiresIn15Minutes, config.jwtSignupSecret);
  };

  verifyKey = (key: any): any => {
    return verifyToken2(key);
  };

  getAuthPackage = (params: any) => {
    const token = createToken(params, expiresIn2H);
    return {
      token,
      apiKey: config.apiKey,
    };
  };
  extractFromToken = extractFromToken;
}
