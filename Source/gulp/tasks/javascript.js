import gulp from "gulp";
import gulp_jspm from "gulp-jspm";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import concat from "gulp-concat";
import config from "../config";
import path from "path";

import rjs from "gulp-requirejs";

import babel from "gulp-babel";

import pkg from "../../package.json";

export function javaScriptPipeline(stream)
{
    let root = path.resolve("./");
    
    stream
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"],
            sourceMaps: true
            //sourceRoot: "../",
            //sourceMaps: "inline"
        }))
        //.pipe(gulp_jspm())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("./", {
            sourceRoot: file => {
                console.log("File : "+file.path);
                
                let directory = path.dirname(file.path);
                directory = directory.substr(root.length);
                return `..${directory}`;
            }
        }))
        .pipe(gulp.dest(config.paths.dist));
    
    return stream;
}

gulp.task("javascript", function ()
{
    var stream = gulp.src(config.paths.javascript,{base:config.paths.base})
    javaScriptPipeline(stream);
    return stream;
});
