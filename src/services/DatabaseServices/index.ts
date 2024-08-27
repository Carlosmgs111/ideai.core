import MongooseAdapter from "./MongooseAdapter";

export const Adapters: any = {
  MongooseAdapter,
};

export const DatabaseService = (adapter: any = Adapters.MongooseAdapter) => {
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
