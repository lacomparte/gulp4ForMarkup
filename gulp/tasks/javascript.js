var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var bro = require('gulp-bro');
var babelify = require('babelify');
var plugins = require('gulp-load-plugins')();
var config = require('../config').javascript;

module.exports = gulp.task(config.taskname, function() {
  return gulp.src(config.src, { allowEmpty:true })
    .pipe(bro({
      transform: [
        babelify.configure({
          presets: ['@babel/preset-env']
        })
      ]
    }))
    .pipe(gulp.dest(config.dest));
});