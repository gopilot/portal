var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var when = require('when');
 var fs = require('fs');

var deploy = require("gulp-gh-pages");
var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./out');

function runServer(port) {
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        }).resume();
    }).listen(port || 8000);
}


gulp.task('deploy', ['stylus', 'jade', 'static', 'scripts'], function () {
    var remote = "https://github.com/gopilot/portal.git";

    return gulp.src("./out/**/*")
        .pipe( deploy( remote ) );
});

// compile css
gulp.task('stylus', function () {
    return gulp.src('./stylus/[!_]*.styl')
        .pipe(stylus({use: ['nib']}))
        .pipe(gulp.dest('./out/css'))
});

// compile our HTML
gulp.task('jade', function() {
    return gulp.src('./jade/**/[!_]*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./out'))
});

gulp.task('default', ['stylus', 'jade', 'scripts', 'static'])

// copy over everything from the static folder (images, etc)
// NOTE: into the root of the out folder
gulp.task('static', function(){
    return when.all([
        gulp.src('./img/**')
        .pipe(gulp.dest('./out/img')),

        gulp.src('./statuc/**')
        .pipe(gulp.dest('./out'))
    ]);
});

gulp.task('scripts', function(){
    return when.all([
        gulp.src('./js/**')
        .pipe(gulp.dest('./out/js')),

        gulp.src('./vendor/**')
        .pipe(gulp.dest('./out/vendor'))
    ]);
});

gulp.task('watch', function() {
    runServer();
    gulp.watch(['./static/**', './img/**'], ['static']);
    gulp.watch('./stylus/*.styl', ['stylus']);
    gulp.watch(['./js/**/*.js', './vendor/**'], ['scripts'])
    gulp.watch(['./jade/**/*.jade'], ['jade']);
});

