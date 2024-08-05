import config from "../../../config";
import mongoose, { Model } from "mongoose";
import { labelCases, Mapfy, setEnums } from "../../../utils";
import { filterAttrs } from "../../../utils";
import { DatabaseAdapterType } from "../IDatabaseAdapter";

interface models {
  [key: string]: typeof Model;
}
interface entities {
  [key: string]: string;
}

interface options {
  size: number;
  page: number;
  related: [string];
  indexation: object;
}

import boom from "@hapi/boom";
export default class MongooseAdapter /* implements DatabaseAdapterType  */ {
  serviceDescription: string = "Mongoose Database Service Adapter";
  connection: typeof mongoose.connection;
  entities: entities = {};
  models: models = {};

  constructor({ url }: any = {}) {
    let test = true;
    if (process.argv.includes("DEV") || process.argv.includes("PROD"))
      test = false;
    const localURL = test ? config.mongoDBTestUrl : config.mongoDBLocalUrl;
    mongoose.connect(localURL || config.mongoDBAtlasURL || "");
    const { connection } = mongoose;
    this.connection = connection;
    connection.once("open", () => {
      ("Mongodb connection stablished");
    });
    connection.on("error", (err: any) => {
      process.exit(0);
    });
  }

  createOne = async (
    entity: string,
    Entity: any,
    options: any = {}
  ): Promise<typeof Model | null> => {
    try {
      let newEntity = await this.models[entity].create(Entity);
      return newEntity._doc;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  };

  createMany = async (entity: string, entities: [string], options: {}) => {
    const entitiesCreated = await this.models[entity].insertMany(entities);
    return entitiesCreated.map((e: any) => ({ ...e._doc }));
  };

  findAll = async (entity: string, options: options) => {
    const { size = 100, page = 0, related = [] } = options;
    const entities = await this.models[entity]
      .find(this.adapter(options))
      .skip(Number(page * size))
      .limit(Number(size))
      .populate(this.getPopulateMap(related));

    return entities.map((e: any) => ({
      ...filterAttrs(e._doc, ["_id", "__v"]),
    }));
  };

  findOne = async (entity: string, options: options) => {
    const { indexation, related = [] } = options;
    if (!indexation) throw boom.conflict("Idexation must be provided!");
    const entityFounded = await this.models[entity]
      .findOne(indexation)
      .populate(this.getPopulateMap(related));
    if (!entityFounded) return null;
    return filterAttrs(entityFounded._doc, ["_id", "__v"]);
  };

  removeOne = async (entity: string, options: options) => {
    if (!options.indexation)
      throw boom.forbidden(
        "Must supply credentials for find and delete entity!"
      );
    return (await this.models[entity].deleteOne(this.adapter(options)))
      .acknowledged;
  };

  updateOne = async (entity: string, data: any, options: options) => {
    try {
      const model = await this.models[entity].updateOne(
        this.adapter(options),
        data
      );
      return model.acknowledged;
    } catch (e: any) {
      return boom.conflict("Entity with same attribute!");
    }
  };

  setOneRelationshipManyToMany = async (refs: any) => {
    const [from, to] = refs;
    const [
      exist,
      { fromModel, toModel, fromLabel, fromQuery, toLabel, toQuery },
    ]: any = await this.checkOneRelationshipN2N(from, to);
    if (exist) throw boom.conflict("Entity exist yet!");
    await fromModel.updateOne(
      {
        [labelCases(toLabel).CP]: [
          ...fromModel[labelCases(toLabel).CP],
          toModel._id,
        ],
      },
      {
        uuid: fromQuery,
      }
    );
    await toModel.updateOne(
      {
        [labelCases(fromLabel).CP]: [
          ...toModel[labelCases(fromLabel).CP],
          fromModel._id,
        ],
      },
      {
        uuid: toQuery,
      }
    );
  };

  updateOneRelationshipN2N = this.setOneRelationshipManyToMany;

  // TODO rename to removeRelationship
  unsetOneRelationshipManyToMany = async (refs: any) => {
    const [from, to] = refs;
    const [
      exist,
      {
        fromModel,
        toModel,
        fromRelated,
        toRelated,
        fromRelatedIndex,
        toRelatedIndex,
        fromLabel,
        toLabel,
        fromQuery,
        toQuery,
      },
    ]: any = await this.checkOneRelationshipN2N(from, to);
    if (!exist) throw boom.conflict("Entity doesn't exist!");
    if (fromRelatedIndex === -1 || toRelatedIndex === -1) return false;
    fromRelated.splice(fromRelatedIndex, 1);
    toRelated.splice(toRelatedIndex, 1);

    await fromModel.updateOne(
      {
        [labelCases(toLabel).CP]: [...fromRelated],
      },
      {
        uuid: fromQuery,
      }
    );
    await toModel.updateOne(
      {
        [labelCases(fromLabel).CP]: [...toRelated],
      },
      {
        uuid: toQuery,
      }
    );
    return true;
  };

  setOneRelationship2One = async (entityObj: any, refs: any) => {
    const relations2One: any = {};
    const mainLabel = Mapfy(entityObj).keys().next().value;
    const mainQuery = Mapfy(entityObj).values().next().value;

    const { _id } = await this.models[labelCases(mainLabel).CS].findOne(
      mainQuery,
      {
        select: "_id",
      }
    );

    for (let ref of refs) {
      const key = Mapfy(ref).keys().next().value;
      const value = Mapfy(ref).values().next().value;
      const referenced = await this.models[labelCases(key).CS].findOne(value);
      relations2One[labelCases(key).CS] = referenced._id;

      await this.models[labelCases(key).CS].updateOne(value, {
        [labelCases(mainLabel).CP]: [
          ...referenced[labelCases(mainLabel).CP],
          _id,
        ],
      });
    }
    await this.models[labelCases(mainLabel).CS].updateOne(
      mainQuery,
      relations2One
    );
    return { ...entityObj, ...relations2One };
  };

  // ? Pending to test
  unsetOneRelationship2One = async (entityObj: any, refs: any) => {
    const mainLabel = Mapfy(entityObj).keys().next().value;
    const mainQuery = Mapfy(entityObj).values().next().value;
    const relations2One: any = {};
    const Entity = await this.models[labelCases(mainLabel).CS]
      .findOne(mainQuery)
      .populate(this.getPopulateMap(refs, true));
    for (let ref of refs) {
      const [label] = ref;
      relations2One[labelCases(label).CS] = "";
      const referenced = (
        await this.models[labelCases(label).CS]
          .findOne(Entity[labelCases(label).CS])
          .select(labelCases(mainLabel).CP)
      )[labelCases(mainLabel).CP];

      await this.models[labelCases(label).CS].updateOne(
        Entity[labelCases(label).CS],
        {
          [labelCases(mainLabel).CP]: [
            ...referenced.filter((r: any) => r !== String(Entity._id)),
          ],
        }
      );
    }

    return { ...entityObj, ...relations2One };
  };

  checkOneRelationshipN2N = async (from: any, to: any) => {
    const fromLabel = Mapfy(from).keys().next().value;
    const fromQuery = Mapfy(from).values().next().value;
    const toLabel = Mapfy(to).keys().next().value;
    const toQuery = Mapfy(to).values().next().value;

    const fromModel = await this.models[labelCases(fromLabel).CS].findOne(
      fromQuery
    );
    const toModel = await this.models[labelCases(toLabel).CS].findOne(toQuery);
    const fromRelated = fromModel[labelCases(toLabel).CP];
    const fromRelatedIndex = fromModel[labelCases(toLabel).CP].indexOf(
      toModel._id
    );

    const toRelated = toModel[labelCases(fromLabel).CP];
    const toRelatedIndex = toModel[labelCases(fromLabel).CP].indexOf(
      fromModel._id
    );
    const exist = fromRelatedIndex !== -1 || toRelatedIndex !== -1;

    return [
      exist,
      {
        fromModel,
        toModel,
        fromRelated,
        toRelated,
        fromRelatedIndex,
        toRelatedIndex,
        fromLabel,
        toLabel,
        fromQuery,
        toQuery,
      },
    ];
  };

  private adapter = (options: any) => {
    let { indexation, related } = options;
    return indexation;
  };

  private getPopulateMap = (related: any, include_id: boolean = false) => {
    const populates: any = [];
    related.forEach((r: any) => {
      const [label, { as = null, attributes = [], credentials = {} } = {}] = r;
      let select = `${include_id ? "_id " : "-_id "}`; // ? for exclude _id attribute
      attributes.forEach((a: any) => (select += `${a} `));
      populates.push({
        path: as || labelCases(label).CP,
        select,
      });
    });
    return populates;
  };

  private removeAttribute = async (entity: any, options: any) => {
    await this.models[entity].updateOne({}, { $unset: options });
  };

  close = async () => {
    await this.connection.close();
  };

  dropAllEntities = async () => {
    // await connection.dropDatabase();
    Mapfy(this.models).forEach((model: any) => {
      model.deleteMany({}, (err: any) => {
        if (err) {
          console.error(err);
        }
      });
    });
  };

  addModel = (modelName: string, model: typeof Model) => {
    this.models[modelName] = model;
    this.entities = setEnums(
      Object.entries(this.models).flatMap((m: any) => m[0])
    );
  };
}
