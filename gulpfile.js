var requireDir = require('require-dir');
var browserSync = require('browser-sync').create('server');

require('./gulp/util/attachErrorHandler')();
requireDir('./gulp/tasks', { recurse: true });
