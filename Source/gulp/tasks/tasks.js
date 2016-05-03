import gulp from "gulp";
import config from "../config";

import server from "gulp-express";

import runSequence from "run-sequence";

import javascript from "./javascript";
import html from "./html";
import less from "./less";

gulp.task("init", (callback) => {
    runSequence("javascript","html","less", callback);
});

gulp.task("server", function() {
    server.run([config.paths.dist+"/main.js"]);
});

gulp.task("default", (callback) => {
    runSequence("init", "server", "watch");
});
