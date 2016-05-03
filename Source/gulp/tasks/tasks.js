import gulp from "gulp";
import config from "../config";

import server from "gulp-express";

gulp.task("init", ["javascript","html"]);

gulp.task("server", function() {
    server.run([config.paths.dist+"/main.js"]);
});

gulp.task("default", ["init","server", "watch"]);

