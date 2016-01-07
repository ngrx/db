import {Database, getIDBFactory, IDBLogger,DBSchema} from './database';
import {DatabaseBackend, IDB_SCHEMA} from './constants';
import {provide} from 'angular2/core';

export * from './database';
export * from './constants';


export const DB_PROVIDERS:any[] = [
  IDBLogger,
  
  provide(DatabaseBackend, {useFactory: getIDBFactory}),
  Database
];

export const provideDB = (schema: DBSchema) => {
  return DB_PROVIDERS.concat([provide(IDB_SCHEMA, {useValue: schema})]);
}

