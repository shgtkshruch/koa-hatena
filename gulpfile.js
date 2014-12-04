var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var handlebars = require('handlebars');

gulp.task('nodemon', function () {
  nodemon({
    script: 'index.js',
    execMap: {
      js: "node --harmony"
    },
    watch: [
      "index.js",
      "views/",
      "public/",
      "model/",
      "lib/"
    ]
  });
});

gulp.task('template', function () {
  var spawn = require('child_process').spawn;
  var hbs = spawn('npm', ['run', 'hbs']);

  hbs.stdout.on('data', function (data) {
    console.log('handlebars: ' + data);
  });

  hbs.stderr.on('data', function (data) {
    console.log('handlebars: ' + data);
  });
});

gulp.task('script', function () {
  browserify({
    entries: ['./src/script/index.js']
  })
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest('./public/script/'));
});

gulp.task('style', function () {
  gulp.src('./src/style/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/style'));
});

gulp.task('default', ['nodemon'], function () {
  gulp.watch('src/script/**/*.js', ['script']);
  gulp.watch('src/style/**/*.scss', ['style']);
  gulp.watch('src/template/*.hbs', ['template']);
});
