// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit=Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.config({
  baseURL: '/base/',
  //transpiler: 'typescript',
  map: {
    'typescript': 'node_modules/typescript/lib/typescript.js',
    '@angular': 'node_modules/@angular',
    'rxjs': 'node_modules/rxjs',
    'spec': 'spec',
    'db': 'src'
  },
  packages: {
    '@angular/core': {
      defaultExtension: 'js',
      main: 'index.js'
    },
    'rxjs': {
      defaultExtension: 'js'
    },
    'db': {
      defaultExtension: 'js'
    },
    'spec': {
      defaultExtension: 'js',
      main: 'db_spec'
    }
  }
});

// Import all the specs, execute their `main()` method and kick off Karma (Jasmine).
System.import('spec').then(function(mod) {
  return;
})
.catch(function(err){
  console.log(err);
})
.then(function() {
  __karma__.start();
}, function(error) {
  __karma__.error(error.stack || error);
});


function onlySpecFiles(path) {
  return /_spec\.js$/.test(path);
}
