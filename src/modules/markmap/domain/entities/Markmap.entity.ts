import { getEntityProperties, filterAttrs } from "../../../../utils";

export class Markmap {
  uuid: string = "";
  title: string = "";
  text: string = "";
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, title, text }: any) {
    this.uuid = uuid;
    this.title = title;
    this.text = text;
    this.createdAt = new Date().getTime();
    this.updatedAt = this.createdAt;
  }
  static createOne = async (
    RepositoryService: any,
    data: any
  ): Promise<Markmap> => {
    const { createdBy } = data;
    const markmap = await RepositoryService.createOne(
      RepositoryService.entities.Markmap,
      new Markmap({ ...data })
    );

    // await RepositoryService.setOneRelationship2One(
    //   { markmap: { uuid: markmap.uuid } },
    //   [
    //     {
    //       user: { name: createdBy },
    //     },
    //   ]
    // );
    return markmap;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    const markmapsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Markmap,
      data.map((markmap: any) => new Markmap({ ...markmap}))
    );

    for (let markmap in markmapsCreated) {
      RepositoryService.setOneRelationship2One(
        { markmap: { uuid: markmapsCreated[markmap].uuid } },
        [
          {
            user: { name: data[markmap].createdBy },
          },
        ]
      );
    }
    return markmapsCreated;
  };

  static load = async (RepositoryService: any, options: any) => {
    const markmap = await Markmap.find(RepositoryService, options);
    if (!markmap) throw new Error("Incorrect indexation!");
    const loadedMarkmap = new Markmap(markmap);
    return loadedMarkmap;
  };

  static find = async (RepositoryService: any, options: any) => {
    const markmap: any = await RepositoryService.findOne(
      RepositoryService.entities.Markmap,
      options
    );
    return markmap;
  };

  static findAll = async (RepositoryService: any, options: any = {}) => {
    const markmaps: any = await RepositoryService.findAll(
      RepositoryService.entities.Markmap,
      options
    );
    return markmaps;
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    // const {
    //   User: { name: createdBy },
    // } = await Markmap.find(RepositoryService, {
    //   indexation: { uuid: this.uuid },
    //   related: [["User", { attributes: ["name"], as: "User" }]],
    // });
    // data.createdBy, createdBy;
    // if (data.createdBy && createdBy !== data.createdBy) {
    //   "Must change relationship".bgYellow;
    //   await RepositoryService.unsetOneRelationship2One(
    //     { markmaps: { uuid: this.uuid } },
    //     [["User", { as: "User" }]]
    //   );
    //   await RepositoryService.setOneRelationship2One(
    //     { markmaps: { uuid: this.uuid } },
    //     [
    //       {
    //         user: { name: data.createdBy },
    //       },
    //     ]
    //   );
    // }

    return await RepositoryService.updateOne(
      RepositoryService.entities.Markmap,
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { indexation: { uuid: this.uuid } }
    );
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    // await RepositoryService.unsetOneRelationship2One(
    //   { markmaps: { uuid: this.uuid } },
    //   [["User", { as: "User" }]]
    // );
    return await RepositoryService.removeOne(
      RepositoryService.entities.Markmap,
      {
        indexation: filterAttrs(
          getEntityProperties(this),
          ["title", "uuid"],
          false
        ),
      }
    );
  };
}
