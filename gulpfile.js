/*
 * Copyright 2017 Uncharted Software Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var gulp            = require('gulp');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var uglify          = require('gulp-uglify');
var handlebars      = require('gulp-handlebars');
var defineModule    = require('gulp-define-module');
var jshint          = require('gulp-jshint');
var minifyCss       = require('gulp-minify-css');
var filter          = require('gulp-filter');
var concat          = require('gulp-concat');
var runSequence     = require('run-sequence');
var sass            = require('gulp-sass');
var karma           = require('karma');
var path            = require('path');
var fs              = require('fs');

require('shelljs/global');

var config = {
    src: './src',
    extern: './extern',
    style : './sass',
    templates : './templates',
    dist: './dist',
    name : 'Facets',
    main : 'main.js'
};


function doBuild(shouldMinify) {
    var build = browserify(config.src + '/' + config.main, {
            debug: !shouldMinify,
            standalone: config.name
        })
        .bundle()
        .on( 'error', function( e ) {
            console.log( e );
            this.emit('end');
        })
        .pipe( source( config.name.toLowerCase() + (shouldMinify ? '.min' : '') + '.js' ) );
    if (shouldMinify) {
       build = build
           .pipe(buffer())
           .pipe(uglify({
               mangle : true
           }));
    }
    build.pipe( gulp.dest( config.dist ) );
    return build;
}

function doCSS(shouldMinify) {
    var build = gulp.src(config.style + '/' + config.name.toLowerCase() + (shouldMinify ? '.min' : '') + '.scss')
        .pipe(sass.sync().on('error', sass.logError));

    if (shouldMinify) {
        build = build.pipe( minifyCss({ keepSpecialComments: 0 }) );
    }

    return build.pipe(gulp.dest(config.dist));
}

gulp.task('lint',function() {
    return gulp.src([
            config.src + '/**/*.js',
            '!' + config.src + '/extern.js',
            '!' + config.src + '/templates/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('tdd', function(done) {
    new karma.Server({
        configFile: path.join(__dirname, './karma.conf.js'),
        reporters: ['mocha']
    }, done).start();
});

gulp.task('test', function(done) {
    if (!fs.existsSync('bamboo')) fs.mkdirSync('bamboo');
    new karma.Server({
        configFile: path.join(__dirname, './karma.conf.js'),
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
    }, function(exitcode) {
        done();
        process.exit(exitcode);
    }).start();
});

gulp.task('build-js', function () {
    return doBuild(false);
});

gulp.task('minify-js',function() {
    return doBuild(true);
});

gulp.task('build-css', function () {
    return doCSS(false);
});

gulp.task('minify-css',function() {
    return doCSS(true);
});

gulp.task('build', gulp.parallel('build-js', 'build-css'), function (done) {
    return done();
});

gulp.task('minify', gulp.parallel('minify-js', 'minify-css'), function (done) {
    return done();
});

// Links library to allow live
gulp.task('jspm:link', function (cb) {
  exec('jspm link -y', {cwd: './'}, function (code, stdout, stderr) {
    if (code !== 0) {
      console.log('JSPM link failed: ', code);
      console.log(stderr);
      cb(new Error('Could not run JSPM link: ' + code));
    } else {
      console.log('JSPM linked.');
      cb();
    }
  });
});

gulp.task('build-extern-js', function() {
    return gulp.src( config.extern + '/**/*.js' )
        .pipe( concat(config.name.toLowerCase() + '.extern.js') )
        .pipe( uglify() )
        .pipe( gulp.dest( config.dist ) );
});

gulp.task('build-extern-css', function() {
    return gulp.src( config.extern + '/**/*.css' )
        .pipe( minifyCss({ keepSpecialComments: 0 }) )
        .pipe( concat(config.name.toLowerCase() + '.extern.css') )
        .pipe( gulp.dest( config.dist ) );
});

gulp.task('build-templates',function() {
    return gulp.src(config.templates + '/**/*.hbs')
        .pipe(handlebars({
			handlebars: require('handlebars')
		}))
        .pipe(defineModule('node'))
        .pipe(gulp.dest(config.src + '/templates/'));
});

gulp.task('watch',function () {
    gulp.watch(config.src + '/**/*.js', ['lint','build-js', 'minify-js']);
    gulp.watch(config.style + '/**/*.scss', ['build-css', 'minify-css']);
    gulp.watch(config.templates + '/**/*.hbs', ['build-templates']);
    gulp.watch(config.dist + '/facets.min.*', ['jspm:link']);
});

gulp.task('install', gulp.series('build-templates', 'lint', gulp.parallel('build','build-extern-js','build-extern-css')), function (done) {
    return done();
});

// gulp.task('install',function(done) {
//     runSequence('build-templates', ['lint'], ['build','build-extern-js','build-extern-css'], done);
// });

gulp.task('deploy', gulp.series('build-templates', 'lint', gulp.parallel('build', 'minify','build-extern-js','build-extern-css')), function (done) {
    return done();
});

// gulp.task('deploy',function(done) {
//     runSequence('build-templates', ['lint'], ['build', 'minify','build-extern-js','build-extern-css'], done);
// });

gulp.task('default', gulp.series('build-templates', 'lint', gulp.parallel('build', 'minify','build-extern-js','build-extern-css'), 'jspm:link', 'watch'), function (done) {
    return done();
});
// gulp.task('default', function(done) {
//     runSequence('build-templates', ['lint'], ['build','minify','build-extern-js','build-extern-css'], 'jspm:link', 'watch', done);
// });
