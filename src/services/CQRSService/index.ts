import { DatabaseService, Adapters } from "../DatabaseServices";
import { TaskMessageService } from "../../config/dependencies";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  private TaskMessageService: any = TaskMessageService;

  constructor() {
    (async () => {
      await this.initSetup();
    })();
  }

  initSetup = async () => {
    await TaskMessageService.subscribe({
      queryService: { createOne: this.QueryService.createOne },
    });
    await TaskMessageService.subscribe({
      queryService: { createMany: this.QueryService.createMany },
    });
    await TaskMessageService.subscribe({
      queryService: { removeOne: this.QueryService.removeOne },
    });
    await TaskMessageService.subscribe({
      queryService: { updateOne: this.QueryService.updateOne },
    });
    await TaskMessageService.subscribe({
      queryService: {
        setOneRelationship2One: this.QueryService.setOneRelationship2One,
      },
    });
    await TaskMessageService.subscribe({
      queryService: {
        unsetOneRelationship2One: this.QueryService.unsetOneRelationship2One,
      },
    });
    await TaskMessageService.subscribe({
      queryService: {
        setOneRelationshipManyToMany:
          this.QueryService.setOneRelationshipManyToMany,
      },
    });
    await TaskMessageService.subscribe({
      queryService: {
        unsetOneRelationshipManyToMany:
          this.QueryService.unsetOneRelationshipManyToMany,
      },
    });
  };

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: {
        createOne: [entity, Entity, options],
      },
    });
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: {
        createMany: [entity, entities, options],
      },
    });
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  removeOne = async (entity: any, options: any) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: { removeOne: [entity, options] },
    });
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    this.checkStatus();
    this.TaskMessageService.publish({
      queryService: {
        updateOne: [entity, Entity, options],
      },
    });
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  setOneRelationship2One = async (entity: any, refs: any) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: {
        setOneRelationship2One: [entity, refs],
      },
    });
    return await this.CommandService.setOneRelationship2One(entity, refs);
  };
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: {
        unsetOneRelationship2One: [entity, refs],
      },
    });
    return await this.CommandService.unsetOneRelationship2One(entity, refs);
  };
  setOneRelationshipManyToMany = async (refs: any) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: {
        setOneRelationshipManyToMany: [refs],
      },
    });
    return await this.CommandService.setOneRelationshipManyToMany(refs);
  };
  unsetOneRelationshipManyToMany = async (refs: any) => {
    this.checkStatus();
    TaskMessageService.publish({
      queryService: {
        unsetOneRelationshipManyToMany: [refs],
      },
    });
    return await this.CommandService.unsetOneRelationshipManyToMany(refs);
  };
  setManyRelationshipsManyToMany = async (refsBatch: any) => {
    // this.checkStatus();
    // TaskMessageService.publish({
    //   queryService: {
    //     setManyRelationshipsManyToMany: [refsBatch],
    //   },
    // });
    return await this.CommandService.setManyRelationshipsManyToMany(refsBatch);
  };
  checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
  entities = { ...this.CommandService.entities, ...this.QueryService.entities };
  checkStatus = () => {
    if (!TaskMessageService.isOnline)
      throw new Error("Task Message Service offline!");
  };
  info = () => {
    console.table({
      "Query Database Service": this.QueryService.serviceDescription,
      "Command Database Service": this.CommandService.serviceDescription,
    });
    return {
      queryDatabaseInterfaceName: this.QueryService.serviceDescription,
      commandDatabaseInterfaceName: this.CommandService.serviceDescription,
    };
  };

  close = async () => {
    await this.CommandService.close();
    await this.QueryService.close();
  };

  dropAllEntities = async () => {
    await this.CommandService.dropAllEntities();
    await this.QueryService.dropAllEntities();
  };
}
