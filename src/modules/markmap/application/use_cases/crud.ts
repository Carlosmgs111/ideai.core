import { Markmap } from "../../domain/entities/Markmap.entity";
import { RepositoryService } from "../../../../config/dependencies";
/*  */

export const createNewMarkmap = async (ctx: any) => {
  const { uuid, title, text, description } = ctx;
  const result = await Markmap.createOne(RepositoryService, {
    uuid,
    title,
    text,
    description,
  });
  if (!result) return { message: "Something went wrong!" };
  return result;
};

export const getManyMarkmaps = async (ctx: any) => {
  const { size = 10, page = 0 } = ctx;
  return await Markmap.findAll(RepositoryService, {
    size,
    page,
    orderBy: { updatedAt: -1 },
  });
};

export const loadMarkmap = async (ctx: any) => {
  const { uuid } = ctx;
  return Markmap.load(RepositoryService, { indexation: { uuid } });
};

export const deleteMarkmap = async (ctx: any) => {
  return new Promise((resolve, reject) => {
    const { uuid } = ctx;
    loadMarkmap({ uuid }).then((markmap: any) => {
      markmap.remove(RepositoryService).then((result: any) => {
        resolve({ deleted: result });
      });
    });
  });
};

export const update = async (ctx: any) => {
  return new Promise((resolve: any, reject: any) => {
    const { uuid, ...attribute } = ctx;
    const [key, value] = Object.entries(attribute)[0];
    loadMarkmap({ uuid }).then((markmap: any) => {
      markmap
        .update(RepositoryService, { [key]: value })
        .then((result: any) => {
          resolve({ updated: result });
        });
    });
  });
};
