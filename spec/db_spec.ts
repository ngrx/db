import * as DB from '../src/database';

import {Injector, provide} from 'angular2/core';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000; 

const todoAppSchema:DB.DBSchema = {
  version: 1,
  name: 'todo_app',
  stores: {
    'todos': {autoIncrement: true},
    'categories': {autoIncrement: true},
    'friends': {autoIncrement: true}
  }
}


//cleanup function
const deleteDatabase = (done) => {
  
  let del = indexedDB.deleteDatabase(todoAppSchema.name);
  
  del.onerror = (err) => {
    del.onblocked = undefined;
    console.error(err);
    throw err;
  }
  del.onsuccess = () => {
    done();
  }
}

describe('database functionality', () => {
  
  let idb:DB.Database;
  let dbBackend;
  let injector:Injector;
  
  beforeEach(() => {
    injector = Injector.resolveAndCreate([
      DB.DB_PROVIDERS,
      DB.provideDB(todoAppSchema)
    ]);
    
    idb = injector.get(DB.Database);
  });
  
  beforeAll((done) => {
    deleteDatabase(done);
  });
  
  it('should instantiate a DB', () => {
    expect(idb).toBeDefined();
  });
  
  it('should open successfully', (done) => {
    let openReq = idb.open(todoAppSchema.name);
    
    openReq.subscribe(db => {
      expect(db).toBeDefined();
      expect(db.objectStoreNames.length).toBe(3);
      done();
    });
  });
  
  it('should insert some data', (done) => {
    idb.insert('todos',[{name: 'todo1'}, {name: 'todo2'}])
      .toArray()
      .subscribe(results => {
        expect(results[0]).toEqual({$key: 1, record: {name: 'todo1'}});
        expect(results[1]).toEqual({$key: 2, record: {name: 'todo2'}});
        done()
      }, err => {
        console.error(err);
        done(err);
      });
  });
  
  it('should insert some more data', (done) => {
    idb.insert('todos',[{name: 'todo3'}, {name: 'todo4'}])
      .toArray()
      .subscribe(results => {
        expect(results[0]).toEqual({$key: 3, record: {name: 'todo3'}});
        expect(results[1]).toEqual({$key: 4, record: {name: 'todo4'}});
        done()
      }, err => {
        console.error(err);
        done(err);
      });
  });
  
  it('should broadcast notifications on insert', (done) => {
    
    let notificationCount = 0;
    
    idb.changes.subscribe(notif => {
      notificationCount++;
    });
    idb.insert('todos',[{name: 'todo5'}, {name: 'todo6'}])
      .toArray()
      .subscribe(() => {}, (err) => {}, () => {
        expect(notificationCount).toBe(2);
        done();
      });
  });
  
  it('should get a record by key', (done) => {
    let found;
    idb.get('todos', 3)
      .subscribe(record => {
        found = record;
      }, err => {
        console.error(err);
        done(err);
      }, () => {
        expect(found).toEqual({name: 'todo3'});
        done()
      });
  });
  
  it('should iterate records', (done) => {
    let found;
    idb.query('todos').toArray()
      .subscribe(records => {
        found = records;
      }, err => {
        console.error(err);
        done(err);
      }, () => {
        expect(found.length).toEqual(6);
        done()
      });
  });
  
  it('should iterate records with a predicate fn', (done) => {
    let found;
    idb.query('todos', (rec) => rec.name === 'todo5').toArray()
      .subscribe(records => {
        found = records;
      }, err => {
        console.error(err);
        done(err);
      }, () => {
        expect(found.length).toEqual(1);
        done()
      });
  });
  
});

