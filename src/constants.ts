import {OpaqueToken} from 'angular2/core';

export const IDB_SUCCESS = 'success';
export const IDB_COMPLETE = 'complete';
export const IDB_ERROR = 'error';
export const IDB_UPGRADE_NEEDED = 'upgradeneeded';

export const DatabaseBackend = new OpaqueToken("IndexedDBBackend");
export const IDB_SCHEMA = new OpaqueToken("IDB_SCHEMA");

export const IDB_TXN_TYPE = {
  READ: 'read',
  READWRITE: 'readwrite'
}