import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subject} from 'rxjs/Subject';
import {OpaqueToken, Inject} from 'angular2/core';

import {DBUpgradeHandler, DBSchema, DBStore} from './interfaces';
import {IDB_SUCCESS, IDB_COMPLETE, IDB_ERROR, IDB_UPGRADE_NEEDED, IDB_SCHEMA, DB_INSERT, DatabaseBackend} from './constants';

export class IDBLogger {
  log(...args){
    console.log.apply(console, args);
  }
}

export const getIDBFactory = () => window.indexedDB || self.indexedDB;

export class Database {
  
  public changes:Subject<any> = new Subject()
  
  private _idb:IDBFactory;
  private _schema: DBSchema;
  private _logger: IDBLogger;
  constructor(_logger:IDBLogger, @Inject(DatabaseBackend) idbBackend:IDBFactory, @Inject(IDB_SCHEMA) schema:DBSchema){
    this._schema = schema;
    this._idb = idbBackend;
    this._logger = _logger;
  }
  
  private _upgradeDB(db:IDBDatabase){
    this._logger.log('upgrading DB');
    
    for(var storeName in this._schema.stores){
      this._createObjectStore(db, storeName, this._schema.stores[storeName]);
    }
    return;
  }
  
  private _createObjectStore(db:IDBDatabase, key:string, schema:DBStore){
    let objectStore = db.createObjectStore(key, {autoIncrement: true});
  }
  
  open(dbName:string, version:number = 1, upgradeHandler?:DBUpgradeHandler):Observable<IDBDatabase> {
    this._logger.log(`opening db ${dbName}`);
    this._logger.log(`schema version ${this._schema.version}`);
    const idb = this._idb;
    return new Observable((observer:Subscriber<any>) => {
      
      const db = idb.open(dbName, this._schema.version);
      
      const onSuccess = (event) => {
        observer.next(event.target.result);
        observer.complete();
      }
      const onError = (err) => {
        console.log(err);
        observer.error(err);
      }
      
      const onUpgradeNeeded = (event) => {
        this._upgradeDB(event.target.result);
      }
      
      db.addEventListener(IDB_SUCCESS, onSuccess);
      db.addEventListener(IDB_ERROR, onError);
      db.addEventListener(IDB_UPGRADE_NEEDED, onUpgradeNeeded);
      
      return () => {
        db.removeEventListener(IDB_SUCCESS, onSuccess);
        db.removeEventListener(IDB_ERROR, onError);
        db.removeEventListener(IDB_UPGRADE_NEEDED, onUpgradeNeeded);
      }
    
    });
  }
  
  deleteDatabase(dbName:string){
    return new Observable((deletionObserver:Subscriber<any>) => {
      
      const deleteRequest = this._idb.deleteDatabase(dbName);
      
      const onSuccess = (event) => {
        deletionObserver.next(null);
        deletionObserver.complete();
      }
      
      const onError = (err) => deletionObserver.error(err);
      
      deleteRequest.addEventListener(IDB_SUCCESS, onSuccess);
      deleteRequest.addEventListener(IDB_ERROR, onError);
      
      return () => {
        deleteRequest.removeEventListener(IDB_SUCCESS, onSuccess);
        deleteRequest.removeEventListener(IDB_ERROR, onError);
      }
    })
  }
  
  insert(storeName:string, records:any[]){
    const changes = this.changes;
    return this.open(this._schema.name)
      .mergeMap(db => {
        return new Observable(txnObserver => {
          const txn = db.transaction([storeName], 'readwrite');
          const objectStore = txn.objectStore(storeName);
          
          const onTxnError = (err) => txnObserver.error(err);
          const onTxnComplete = () => txnObserver.complete();
          
          txn.addEventListener(IDB_COMPLETE, onTxnComplete);
          txn.addEventListener(IDB_ERROR, onTxnError);
          
          const makeRequest = (record) => {
            return new Observable(reqObserver => {
              let req = objectStore.add(record);
              req.addEventListener(IDB_SUCCESS, () => {
                let $key = req.result
                reqObserver.next({$key, record});
              });
              req.addEventListener(IDB_ERROR, (err) => {
                reqObserver.error(err);
              })
            });
          }
          
          let requestSubscriber = Observable.from(records)
            .mergeMap(makeRequest)
            .do(payload => changes.next({type: DB_INSERT, payload }))
            .subscribe(txnObserver);
          
          return () => {
            txn.removeEventListener(IDB_COMPLETE, onTxnComplete);
            txn.removeEventListener(IDB_ERROR, onTxnError);
          }
        });
      });
  }
  
  compare(a:any, b:any):number{
    return this._idb.cmp(a, b);
  }
}



