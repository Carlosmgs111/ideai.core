import boom from "@hapi/boom";
import config from "../../../config";
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { load } from "../../../modules/users/application/use_cases";
import url from "url";

interface UserJwtPayload {
  uuid: string; // The user Id
  iat: number; // Issued at
  exp: number; // Expire time
  email: string; // The user email
  username: string;
}

export const verifyToken = async (req: any) => {
  const { authorization } = req.headers;
  const { token: urlToken } = url.parse(req.url || "", true).query;
  const token = (authorization || urlToken || "").replace("Bearer ", "");
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(config.jwtAccessSecret)
    );

    return verified.payload as unknown as UserJwtPayload;
  } catch (e) {
    throw new Error("Invalid token");
  }
};

// * for check api-key and verify its privilege
export function checkApiKey(req: any, res: any, next: Function) {
  const apiKey = req.headers["api-key"];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

// ! deprecated
export function checkAdminRole(req: any, res: any, next: Function) {
  const user: any = req.user;
  if (user.role === "admin") {
    next();
  } else {
    next(boom.unauthorized());
  }
}

// * Closure function that return a express handler
export function checkRoles(...roles: string[]) {
  return (req: any, res: any, next: Function) => {
    const user: any = req.user;
    if (roles.includes(user.privilege || user.role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
}

export async function authMiddleware(req: any, res: any, next: Function) {
  try {
    const payload = await verifyToken(req);
    req.user = await load({
      uuid: payload.uuid,
      username: payload.username,
    });
  } catch (e: any) {
    console.log({ e });
    next(boom.unauthorized());
  } finally {
    next();
  }
}
