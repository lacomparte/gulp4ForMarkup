var fs = require('fs');
var path = require('path');

module.exports = function mkdirSync(filepath){
    var sep = path.sep,
        aDirs = filepath.split(sep),
        aDirpath = [],
        tmpPath;

    while(aDirs.length > 1){
        aDirpath.push(aDirs.shift());
        tmpPath = aDirpath.join(sep);
        if(!fs.existsSync(tmpPath)){
            fs.mkdirSync(tmpPath);
        }
    }
};
