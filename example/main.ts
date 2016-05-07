import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {Database, provideDB, DBSchema} from '../src/index';

const todoAppSchema: DBSchema = {
  version: 1,
  name: 'todo_app',
  stores: {
    'todos': {autoIncrement: true},
    'categories': {autoIncrement: true},
    'friends': {autoIncrement: true}
  }
};



@Component({
  selector: 'demo-app',
  template: `
    <div>Hello world</div>
  `
})
class DatabaseDemo {
  constructor(public db: Database) {
    db.insert('todos', [{name: 'todo1'}, {name: 'todo2'}, {name: 'todo3'}])
    .subscribe(
      rec => console.log(rec),
      err => console.error(err),
      () => console.log('inserted records')
     );
  }
}

bootstrap(DatabaseDemo, [provideDB(todoAppSchema)]);
