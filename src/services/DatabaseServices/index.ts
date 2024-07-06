import SequelizeAdapter from "./SequelizeAdapter";
import MongooseAdapter from "./MongooseAdapter";
import { DatabaseAdapterType } from "./IDatabaseAdapter";

export const Adapters: any = {
  SequelizeAdapter,
  MongooseAdapter,
};

export const DatabaseService = (adapter: any = Adapters.SequelizeAdapter) => {
  class DatabaseService extends adapter {
    constructor(props: any) {
      super(props);
    }

    info() {
      console.table({ "Database Service": this.serviceDescription });
      return { databaseInterfaceName: this.serviceDescription };
    }
  }

  return new DatabaseService({});
};
