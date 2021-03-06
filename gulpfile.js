'use strict';

var fs = require('fs');

//config
var config = {
    browserSyncOptions: {
        server: {
            baseDir: "./dist"
        }
    },
    source: {
        path: "./app/",
        jsPath: "./app/scripts/",
        vendorCssPath: "./app/css/",
        sassPath: "./app/sass/",
        imagesPath: "./app/images/",
        fontsPath: "./app/fonts/",
        vendorCssFiles: [
            "./app/css/vendor.css",
        ],
        sassFile: "./app/sass/main.scss",
        vendorScripts: [
            "node_modules/es6-promise/dist/es6-promise.auto.min.js",
            "node_modules/lodash/lodash.min.js",
            "node_modules/breakpoints-js/dist/breakpoints.min.js",
            "node_modules/zepto/dist/zepto.min.js"
        ],
        bundleScripts: [
            "app/scripts/main.js"
        ]
    },
    dist: {
        path: "./dist/",
        jsPath: "assets",
        cssPath: "assets",
        imagesPath: "assets/images",
        fontsPath: "assets/fonts",
        vendorCssName: "vendor.min.css",
        vendorJsName: "vendor.min.js",
        bundleCssName: "bundle.min.css",
        bundleJsName: "bundle.min.js"
    }
}

require('babel-core/register');
var gulp = require('gulp');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify-es').default;
var pump = require('pump');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var image = require('gulp-image');
var postcss = require('gulp-postcss');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();

//tasks
gulp.task('html', function(){
    gulp.src(config.source.path + '*.html')
        .pipe(gulp.dest(config.dist.path));
});

gulp.task('image', function(){
    gulp.src(config.dist.path + config.dist.imagesPath + '**/*')
        .pipe(clean({read: false, force: true}));

    gulp.src(config.source.imagesPath + '**/*')
        .pipe(image())
        .pipe(gulp.dest(config.dist.path + config.dist.imagesPath));
});

gulp.task('font', function(){
    gulp.src(config.dist.path + config.dist.fontsPath + '**/*')
        .pipe(clean({read: false, force: true}));

    gulp.src(config.source.fontsPath + '**/*')
        .pipe(gulp.dest(config.dist.path + config.dist.fontsPath));
});

gulp.task('vendor-css', function () {
    return gulp.src(config.source.vendorCssFiles)
        .pipe(concat(config.dist.vendorCssName))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(postcss([autoprefixer({ browsers: ['last 3 versions'] })]))
        .pipe(gulp.dest(config.dist.path + config.dist.cssPath))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('sass', function () {
    return gulp.src(config.source.sassFile)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(postcss([autoprefixer({ browsers: ['last 3 versions'] })]))
        .pipe(rename(config.dist.bundleCssName))
        .pipe(gulp.dest(config.dist.path + config.dist.cssPath))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('vendor-js', function() {
    return gulp.src(config.source.vendorScripts)
        .pipe(concat(config.dist.vendorJsName))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.path + config.dist.jsPath))
        .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('bundle-js', function() {
    return gulp.src(config.source.bundleScripts)
        .pipe(babel())
        .pipe(concat(config.dist.bundleJsName))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.path + config.dist.jsPath))
        .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('serve', function () {
    // Serve files from the root of this project
    browserSync.init(config.browserSyncOptions);
    gulp.watch([config.source.path+'*.html', config.source.vendorCssPath+'**/*.css', config.source.sassPath+'**/*.scss', config.source.jsPath+'**/*.js'], ['html', 'css', 'js']).on('change', function(){
        browserSync.reload({stream: true});
    });
});

gulp.task('clean', function() {
    return gulp.src(config.dist.path)
        .pipe(clean({read: false, force: true}));
});

gulp.task('css', ['vendor-css', 'sass']);
gulp.task('js', ['vendor-js', 'bundle-js']);
gulp.task('build', function(callback) {
    runSequence('clean',
                ['image', 'font', 'js', 'css'],
                'html',
                callback);
});