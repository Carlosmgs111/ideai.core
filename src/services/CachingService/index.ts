import { Mapfy } from "../../utils";

export class CachingService {
  db: any = {};
  constructor() {}
  addTable = (tableName: any) => {
    if (this.db[tableName]) return;
    this.db[tableName] = {};
  };
  addData = (tableName: any, index: any, data: any) => {
    this.db[tableName][index] = data;
  };
  getData = (tableName: any, index: any) => {
    return this.db[tableName][index];
  };
  appendStringData = (tableName: any, index: any, data: any) => {
    Mapfy(data).forEach((value: any, column: any) => {
      let str: string = this.db[tableName][index][column];
      str += value;
      this.db[tableName][index] = {
        ...this.db[tableName][index],
        [column]: str,
      };
    });
  };
  getDb = () => this.db;
}
