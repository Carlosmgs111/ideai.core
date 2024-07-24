import { Markmap } from "../../domain/entities/Markmap.entity";
import { RepositoryService } from "../../../../config/dependencies";
/*  */

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
