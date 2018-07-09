require('es6-promise').polyfill();
var gulp = require('gulp');
var rtlcss = require('gulp-rtlcss');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-uglifycss'); // Minifies CSS files

var imagemin = require('gulp-imagemin');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var onError = function (err) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};

// Css
gulp.task('css', function() {
  return gulp.src('./styles/**/*.css')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(minifycss())
  .pipe(autoprefixer())
  .pipe(gulp.dest('./'))

  .pipe(rtlcss())                     // Convert to RTL
  .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
  .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
});

gulp.task('js', function() {
  return gulp.src(['./js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});

gulp.task('images', function() {
  return gulp.src('./images/src/*')
    .pipe(plumber({errorHandler: onError}))
    .pipe(imagemin({optimizationLevel: 7, progressive: true}))
    .pipe(gulp.dest('./images/dist'));
});


gulp.task('watch', function() {
  browserSync.init({
    files: ['./**/*.php'],
    proxy: 'http://localhost',
  });

  gulp.watch('./styles/**/*.css', ['css', reload]);
  gulp.watch('./js/*.js', ['js', reload]);
  gulp.watch('images/src/*', ['images', reload]);
});

// default task
gulp.task('default', [ 'css', 'js', 'images', 'watch']);
