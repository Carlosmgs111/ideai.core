
import config from "../../config";

export const S = 1; // seconds
export const M = 60 * S; // minutes
export const H = 60 * M; // hours
export const D = 24 * H; // days

export const expiresIn15Minutes = M * 15;
export const expiresIn2H = config.jwtExp || H * 2;
export const expiresIn1Month = D * 30;