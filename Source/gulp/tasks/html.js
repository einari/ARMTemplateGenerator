import gulp from "gulp";
import config from "../config";


export function htmlPipeline(stream) {
    stream.pipe(gulp.dest(config.paths.dist));
    return stream;
}

gulp.task("html", () => {
    var stream = gulp.src(config.paths.html,{base:config.paths.base});
    htmlPipeline(stream);
    return stream;
});



/*
"use strict";

var gulp = require("gulp");

gulp.task("html", function() {
    return gulp.src(global.paths.html)
        .pipe(gulp.dest(global.paths.dist));
});*/