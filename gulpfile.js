// Load plugins
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var stripdebug = require('gulp-strip-debug');     
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var del = require('del');
var imagemin = require('gulp-imagemin');

// error function for plumber
var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
  'last 3 versions',
  'ie >= 8',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
 
// Styles
gulp.task('styles', function() {
  return sass('sass/main.scss', { style: 'expanded' })
	.pipe(plumber({ errorHandler: onError })) 
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(notify({ message: 'Styles task complete' }))
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src([
        'dist/assets/bower_components/jengine-jqlite/jqlite.js',
        'dist/assets/bower_components/angular/angular.js',
        'dist/assets/bower_components/angular/angular.js',
		'dist/assets/bower_components//angular-route/angular-route.js'
    ])
	.pipe(plumber({ errorHandler: onError })) 
	.pipe(concat('main.js'))
	.pipe(gulp.dest('public/javascripts'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('public/javascripts'))
	.pipe(notify({ message: 'Scripts task complete'}));
});
 
// Clean
gulp.task('clean', function(cb) {
    del(['public/stylesheets', 'public/javascripts'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts');
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('sass/**/*.scss', ['styles']);
 
  // Watch .js files
  gulp.watch('dist/assets/bower_components/**/*.js', ['scripts']);
  
  // Create LiveReload server
  livereload.listen();
 
  // Watch any files in dist/, reload on change
  gulp.watch(['public/**']).on('change', livereload.changed);
 
});