import { User } from "../../users/domain/entity";
import {
  RepositoryService,
  AuthServices,
} from "../../../config/dependencies";
import { filterAttrs, decryptData } from "../../../utils";
import config from "../../../config";
import boom from "@hapi/boom";

export const login = async (credentials: any) => {
  const account = await User.authLoad(RepositoryService, {
    credentials,
    // related: [["Institution"], ["Certification"]],
  });
  if (!account) throw new Error("The account doesn't exist!");
  let response = AuthServices.getAuthPackage({
    ...filterAttrs(
      account,
      ["uuid", "email", "username", "privilege", "createdAt", "avatar"],
      false
    ),
    apiKey: config.apiKey,
  });
  return response;
};

export const logout = async (credentials?: any) => {
  return { message: "Logout succesfully!" };
};

export const signup = async (credentials: any) => {
  const { username, email, password } = credentials;
  if (email) {
    console.log(
      "Authentication Signup use case must be implemented! ".bgYellow
    );
  }
  const account = await User.create(RepositoryService, credentials);
  let response = AuthServices.getAuthPackage({
    ...filterAttrs(
      account,
      ["uuid", "email", "username", "privilege", "createdAt", "avatar"],
      false
    ),
    apiKey: config.apiKey,
  });
  return response;
};

export const unsubscribe = async (credentials: any) => {
  RepositoryService;
  const account = await User.authLoad(RepositoryService, credentials);
  if (account) await account.remove(RepositoryService);
};

export const authSignin = async (credentials: any) => {
  RepositoryService;
  const entity = await User.authLoad(RepositoryService, credentials);
  if (!entity) throw new Error("The account doesn't exist!");
  const isMatch = entity.comparePassword(credentials.password);
  if (!isMatch) throw new Error("The account doesn't exist!");
  return entity;
};

export const signin = async (data: any) => {
  if (
    !(
      new Map(Object.entries(data)).has("email") ||
      new Map(Object.entries(data)).has("username")
    )
  )
    throw boom.badRequest("Require username or email!");
  return await User.authLoad(RepositoryService, { credentials: data });
};

// ! possible vulnerability detected!
export const resetAuthPassword = async (credentials: any) => {
  RepositoryService;
  const { token } = credentials;
  const { email, cipheredPassword } = AuthServices.verifyKey(token);
  const newPassword = decryptData(
    cipheredPassword,
    config.jwtSignupSecret || ""
  );
  const account = await User.authLoad(RepositoryService, {
    credentials: { email },
  });
  const oldPassword = account.password;
  account.changePassword(RepositoryService, { newPassword, oldPassword }); // ! check this method
  return "OK";
};
