import { Markmap } from "../../domain/entities/Markmap.entity";
import { RepositoryService } from "../../../../config/dependencies";
/*  */

export const createNewMarkmap = async (ctx: any) => {
  const { uuid, title, text } = ctx;
  const result = await Markmap.createOne(RepositoryService, {
    uuid,
    title,
    text,
  });
  if (!result) return { message: "Something went wrong!" };
  return result;
};

export const getManyMarkmaps = async (ctx: any) => {
  const { size = 10, page = 0 } = ctx;
  return await Markmap.findAll(RepositoryService, { size, page });
};

export const updateMarkmap = async (ctx: any) => {
  return new Promise((resolve: any, reject: any) => {
    const { uuid, text } = ctx;
    Markmap.load(RepositoryService, { indexation: { uuid } }).then(
      (markmap: any) => {
        markmap.update(RepositoryService, { text }).then((result: any) => {
          resolve({ updated: result });
        });
      }
    );
  });
};
