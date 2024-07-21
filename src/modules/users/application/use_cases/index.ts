import { User } from "../../domain/entity";
import {
  RepositoryService,
  MailerService,
} from "../../../../config/dependencies";

export const load = async (credentials: any) =>
  await User.load(RepositoryService, { credentials });

export const getAllUsername = async (ctx: any) => {
  return (await User.findAll(RepositoryService)).map(
    ({ username }: any) => username
  );
};
