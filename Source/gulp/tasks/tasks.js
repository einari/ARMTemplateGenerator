import gulp from "gulp";
import config from "../config";

import server from "gulp-express";

import runSequence from "run-sequence";

import javascript from "./javascript";
import html from "./html";
import less from "./less";
import staticContent from "./staticContent";
import packageContent from "./packageContent";

import pkg from "../../package.json";

gulp.task("init", (callback) => {
    runSequence("javascript","html","less","staticContent", "packageContent", callback);
});

gulp.task("server", function() {
    server.run([pkg.main]);
});

gulp.task("default", (callback) => {
    runSequence("init", "server", "watch");
});
