import {Database, getIDBFactory, IDBLogger} from './database';
import {DatabaseBackend, IDB_SCHEMA} from './constants';
import {DBSchema} from './interfaces';
import {provide} from 'angular2/core';

export * from './database';
export * from './interfaces';


export const DB_PROVIDERS:any[] = [
  IDBLogger,
  
  provide(DatabaseBackend, {useFactory: getIDBFactory}),
  Database
];

export const provideDB = (schema: DBSchema) => {
  return DB_PROVIDERS.concat([provide(IDB_SCHEMA, {useValue: schema})]);
}

