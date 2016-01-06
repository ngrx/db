export interface DBUpgradeHandler {
  (db:IDBDatabase):void;
}

export interface DBStore {
  primaryKey?: string;
  autoIncrement?:boolean;
}

export interface DBSchema {
  version: number,
  name: string,
  stores:{[storename:string]:DBStore}
}