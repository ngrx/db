var ts = require("typescript");
var path = require('path');
console.log('compiling...');
var createTSCPreprocessor = function (args, config, logger, helper) {
    config = config || {};
    var log = logger.create('preprocessor.typescript');
    var defaultOptions = {
        bare: true,
        sourceMap: false
    };
    var options = helper.merge(defaultOptions, args.options || {}, config.options || {});
    var transformPath = args.transformPath || config.transformPath || function (filepath) {
        return filepath.replace(/\.ts$/, '.js');
    };
    return function (content, file, done) {
        //console.log(content, file, done)
        var result = null;
        var map;
        var datauri;
        log.debug('Processing "%s".', file.originalPath);
        file.path = transformPath(file.originalPath);
        // Clone the options because coffee.compile mutates them
        var opts = helper._.clone(options);
        try {
            result = ts.transpile(content, { module: 1 /* CommonJS */, emitDecoratorMetadata: true });
            console.log(result)
        }
        catch (e) {
            log.error('%s\n  at %s:%d', e.message, file.originalPath);
            return done(e, null);
        }
        if (result.v3SourceMap) {
            map = JSON.parse(result.v3SourceMap);
            map.sources[0] = path.basename(file.originalPath);
            map.sourcesContent = [content];
            map.file = path.basename(file.path);
            file.sourceMap = map;
            datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64');
            done(null, result.js + '\n//@ sourceMappingURL=' + datauri + '\n');
        }
        else {
            done(null, result.js || result);
        }
    };
};
createTSCPreprocessor['$inject'] = ['args', 'config.tscPreprocessor', 'logger', 'helper'];
// PUBLISH DI MODULE
module.exports = {
    'preprocessor:tsc': ['factory', createTSCPreprocessor]
};
