import { RepositoryService } from "../../../../config/dependencies";

// ! All this use case are for use of developing team

export const updateAllMarkmapsWithNewAttributes = async (ctx: any) => {
  // ! This especific access to Mongoose model to update all entries
  // ! Do not pull to production, instead abstract to a interface
  await RepositoryService.models.User.updateOne(
    { username: "drehskil" },
    { $set: { Markmaps: [] } }
  );
  return new Promise(async (resolve, reject) => {
    const result = await RepositoryService.models.Markmap.updateMany(
      {},
      { $set: { Users: [] } }
    );
    resolve(result);
  });
};

export const associateUserToMarkmap = async (ctx: any) => {
  const { userUUID, markmapUUID } = ctx;
  return RepositoryService.setOneRelationshipManyToMany([
    {
      markmap: {
        uuid: markmapUUID,
      },
    },
    { user: { uuid: userUUID } },
  ]);
};

export const associateAllOrphanMarkmapsToSingleUser = async (ctx: any) => {
  return new Promise(async (resolve, reject) => {
    const drehskil: any = (await RepositoryService.models.User.find())[0];
    const markmaps = await RepositoryService.models.Markmap.find({
      // Users: { $exists: false },
    });
    for (let markmap of markmaps) {
      const result = await associateUserToMarkmap({
        userUUID: drehskil.uuid,
        markmapUUID: markmap.uuid,
      });
      if (result) continue;
      if (!result) return;
    }
    resolve(true);
  });
};
