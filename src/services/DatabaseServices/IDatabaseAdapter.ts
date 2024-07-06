export type DatabaseAdapterType = {
  createOne: (entity: any, Entity: any, options: any) => {};
  close:()=>{}
};
