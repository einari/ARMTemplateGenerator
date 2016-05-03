import gulp from "gulp";
import config from "../config";

import server from "gulp-express";

import runSequence from "run-sequence";

gulp.task("init", (callback) => {
    runSequence("javascript","html", callback);
});

gulp.task("server", function() {
    server.run([config.paths.dist+"/main.js"]);
});

gulp.task("default", (callback) => {
    runSequence("init", "server", "watch");
});
