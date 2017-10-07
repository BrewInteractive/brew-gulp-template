'use strict';

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./gulp.config.json'));

//config
var browserSyncOptions = config.browserSyncOptions;
var sourcePath = config.source["path"];
var sourceImagePath = config.source["images-path"];
var sourceFontPath = config.source["fonts-path"];
var sourceJsPath = config.source["js-path"];
var sourceSassPath = config.source["sass-path"];
var sourceVendorCssPath = config.source["vendor-css-path"];
var sourceVendorCssFile = config.source["vendor-css-file"];
var sourceSassFile = config.source["sass-file"];
var sourceVendorScripts = config.source["vendor-scripts"];
var sourceBundleScripts = config.source["bundle-scripts"];
var distPath = config.dist["path"];
var distJsPath = distPath + config.dist["js-path"];
var distCssPath = distPath + config.dist["css-path"];
var distImagePath = distPath + config.dist["images-path"];
var distFontPath = distPath + config.dist["fonts-path"];
var distVendorCssName = config.dist["vendor-css-name"];
var distVendorJsName = config.dist["vendor-js-name"];
var distBundleCssName = config.dist["bundle-css-name"];
var distBundleJsName = config.dist["bundle-js-name"];

//libs
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
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
    gulp.src(sourcePath + '*.html')
        .pipe(gulp.dest(distPath));
});

gulp.task('image', function(){
    gulp.src(sourceImagePath + '/**/*')
        .pipe(image())
        .pipe(gulp.dest(distImagePath));
});

gulp.task('font', function(){
    gulp.src(sourceFontPath + '/**/*')
        .pipe(gulp.dest(distFontPath));
});

gulp.task('vendor-css', function () {
    return gulp.src(sourceVendorCssFile)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(postcss([autoprefixer({ browsers: ['last 3 versions'] })]))
        .pipe(rename(distVendorCssName))
        .pipe(gulp.dest(distCssPath))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('sass', function () {
    return gulp.src(sourceSassFile)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(postcss([autoprefixer({ browsers: ['last 3 versions'] })]))
        .pipe(rename(distBundleCssName))
        .pipe(gulp.dest(distCssPath))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('vendor-js', function() {
    return gulp.src(sourceVendorScripts)
        .pipe(concat(distVendorJsName))
        .pipe(uglify())
        .pipe(gulp.dest(distJsPath))
        .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('bundle-js', function() {
    return gulp.src(sourceBundleScripts)
        .pipe(concat(distBundleJsName))
        .pipe(uglify())
        .pipe(gulp.dest(distJsPath))
        .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('serve', function () {
    // Serve files from the root of this project
    browserSync.init(browserSyncOptions);
    gulp.watch([sourcePath+'*.html', sourceVendorCssPath+'/**/*.css', sourceSassPath+'/**/*.scss', sourceJsPath+'/**/*.js'], ['html', 'css', 'js']).on('change', function(){
        browserSync.reload({stream: true});
    });
});

gulp.task('css', ['vendor-css', 'sass']);
gulp.task('js', ['vendor-js', 'bundle-js']);
gulp.task('build', ['html', 'image', 'font', 'js', 'css']);