import gulp from "gulp";
import gulp_jspm from "gulp-jspm";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import config from "../config";

import rjs from "gulp-requirejs";

import babel from "gulp-babel";

gulp.task("javascript_", function() {
    return gulp.src(global.paths.javascript)
        .pipe(gulp.dest(global.paths.dist));    
});

gulp.task("_javascript", () => {
   rjs({
       name: "app",
       baseUrl: "./",
       out: "require_bundle.js"
   }).pipe(gulp.dest(config.paths.dist));
});


gulp.task("javascript", function ()
{
    return gulp.src(config.paths.appFile)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp_jspm())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task("javascript__", function() {
   return gulp.src("./app.js")
        .pipe(sourcemaps.init())
        .pipe(gulp_jspm({ selfExecutingBundle: true }))
        .pipe(rename("bundle.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.dist));
});
