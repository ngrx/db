// Karma configuration
// Generated on Wed Jan 06 2016 19:58:14 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    
    plugins: [ require('./spec/support/tsc-preprocessor'), 'karma-jasmine'],
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/systemjs/dist/system.js',
      'spec/support/karma-system.js',
      'node_modules/reflect-metadata/Reflect.js',
      {pattern: 'node_modules/angular2/src/**/*.js', included: false},
      {pattern: 'node_modules/angular2/*.js', included: false},
      {pattern: 'node_modules/rxjs/**/*.js', included: false},
      
      {pattern: 'src/**/*', included: false},
      {pattern: 'spec/**/*', included: false},
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/*.ts': ['tsc'],
      'src/*.ts': ['tsc']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
