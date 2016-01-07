import * as DB from '../src/index';

import {Injector, provide} from 'angular2/core';

const todoAppSchema:DB.DBSchema = {
  version: 1,
  name: 'todo_app',
  stores: {
    'todos': {autoIncrement: true},
    'categories': {autoIncrement: true},
    'friends': {autoIncrement: true}
  }
}

describe('sanity check', () => {
  it('should run tests', () => {
    expect(true).toBe(true);
  });
});

describe('database test', () => {
  
  let idb:DB.Database;
  let dbBackend;
  let injector:Injector;
  
  beforeEach(() => {
    injector = Injector.resolveAndCreate([
      DB.DB_PROVIDERS,
      DB.provideDB(todoAppSchema),
      //provide(DB.DatabaseBackend, {useValue: mockDB.mockIndexedDB})
    ]);
    
    idb = injector.get(DB.Database);
  });
  
  it('should instantiate a DB', () => {
    expect(idb).toBeDefined();
  });
  
  it('should open successfully', (done) => {
    let openReq = idb.open('testapp');
    
    openReq.subscribe(db => {
      expect(db).toBeDefined();
      done();
    });
  });
});

