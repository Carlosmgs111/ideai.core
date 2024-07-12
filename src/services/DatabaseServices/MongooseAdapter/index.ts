import { connect, connection } from "./infrastructure";
import models from "./infrastructure/models";
import { model } from "mongoose";
import { labelCases, Mapfy, setEnums } from "../../../utils";
import { filterAttrs } from "../../../utils";

import boom from "@hapi/boom";
export default class MongooseAdapter /* implements DatabaseAdapter */ {
  serviceDescription: string = "Mongoose Database Service Adapter";
  Entity: any;

  constructor({}: any = {}) {
    connect();
  }

  createOne = async (
    entity: any,
    Entity: any,
    options: any = {}
  ): Promise<typeof model | null> => {
    try {
      let newEntity = await models[entity].create(Entity);
      return newEntity._doc;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  };

  createMany = async (entity: any, entities: any, options: any) => {
    const entitiesCreated = await models[entity].insertMany(entities);
    return entitiesCreated.map((e: any) => ({ ...e._doc }));
  };

  findAll = async (entity: any, options: any) => {
    const { size = 100, page = 0, related = [] } = options;
    const entities = await models[entity]
      .find(this.adapter(options))
      .populate(this.getPopulateMap(related))
      .limit(Number(size))
      .skip(Number(page));
    return entities.map((e: any) => ({
      ...filterAttrs(e._doc, ["_id", "__v"]),
    }));
  };

  findOne = async (entity: any, options: any) => {
    const { credentials, related = [] } = options;
    if (!credentials) throw boom.conflict("Idexation must be provided!");
    const entityFounded = await models[entity]
      .findOne(credentials)
      .populate(this.getPopulateMap(related));
    if (!entityFounded) return null;
    return filterAttrs(entityFounded._doc, ["_id", "__v"]);
  };

  removeOne = async (entity: any, options: any) => {
    if (!options.credentials)
      throw boom.forbidden(
        "Must supply credentials for find and delete entity!"
      );
    return await models[entity].deleteOne(this.adapter(options));
  };

  updateOne = async (entity: any, Entity: any, options: any) => {
    try {
      const model = await models[entity].updateOne(
        this.adapter(options),
        Entity
      );
      return model._doc;
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

  setOneRelationship2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    const mainLabel = Mapfy(entity).keys().next().value;
    const mainQuery = Mapfy(entity).values().next().value;

    const { _id } = await models[labelCases(mainLabel).CS].findOne(mainQuery, {
      select: "_id",
    });

    for (let ref of refs) {
      const key = Mapfy(ref).keys().next().value;
      const value = Mapfy(ref).values().next().value;
      const referenced = await models[labelCases(key).CS].findOne(value);
      relations2One[labelCases(key).CS] = referenced._id;

      await models[labelCases(key).CS].updateOne(value, {
        [labelCases(mainLabel).CP]: [
          ...referenced[labelCases(mainLabel).CP],
          _id,
        ],
      });
    }
    await models[labelCases(mainLabel).CS].updateOne(mainQuery, relations2One);
    return { ...entity, ...relations2One };
  };

  // ? Pending to test
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    const mainLabel = Mapfy(entity).keys().next().value;
    const mainQuery = Mapfy(entity).values().next().value;
    const relations2One: any = {};
    const Entity = await models[labelCases(mainLabel).CS]
      .findOne(mainQuery)
      .populate(this.getPopulateMap(refs, true));
    for (let ref of refs) {
      const [label] = ref;
      relations2One[labelCases(label).CS] = "";
      const referenced = (
        await models[labelCases(label).CS]
          .findOne(Entity[labelCases(label).CS])
          .select(labelCases(mainLabel).CP)
      )[labelCases(mainLabel).CP];

      await models[labelCases(label).CS].updateOne(
        Entity[labelCases(label).CS],
        {
          [labelCases(mainLabel).CP]: [
            ...referenced.filter((r: any) => r !== String(Entity._id)),
          ],
        }
      );
    }

    return { ...entity, ...relations2One };
  };

  checkOneRelationshipN2N = async (from: any, to: any) => {
    const fromLabel = Mapfy(from).keys().next().value;
    const fromQuery = Mapfy(from).values().next().value;
    const toLabel = Mapfy(to).keys().next().value;
    const toQuery = Mapfy(to).values().next().value;

    const fromModel = await models[labelCases(fromLabel).CS].findOne(fromQuery);
    const toModel = await models[labelCases(toLabel).CS].findOne(toQuery);
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
    let { credentials, related } = options;
    return credentials;
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
    await models[entity].update({}, { $unset: options });
  };

  entities = setEnums(Object.entries(models).flatMap((m: any) => m[0]));

  close = async () => {
    await connection.close();
  };

  dropAllEntities = async () => {
    // await connection.dropDatabase();
    Mapfy(models).forEach((model: any) => {
      model.deleteMany({}, (err: any) => {
        if (err) {
          console.error(err);
        }
      });
    });
  };
}
