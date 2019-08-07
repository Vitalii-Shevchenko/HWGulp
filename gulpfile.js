const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

gulp.task('html', (done) => {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('scss', (done) => {
    gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('js', (done) => {
    gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('images', () =>
    gulp.src('src/img/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'))
);

gulp.task('browser-init',(done) =>{
    browserSync.init({
        server: "./dist"
    });
    done();
});

gulp.task("watch", (done) => {
    gulp.watch("./src/*.html", gulp.series("html"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*.js", gulp.series("js"));
    gulp.watch("./src/img/**/*", gulp.series("images"));
    return;
});

gulp.task("default", gulp.series("html", "scss", "js", "images", "browser-init", "watch"));