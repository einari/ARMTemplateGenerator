import gulp from "gulp";
import path from "path";
import util from "gulp-util";
import config from "../config";

console.log("Watcher going...");
gulp.task("watch", () => {
    console.log("Watch");
    gulp.watch(config.paths.javascript).on("change", (event) => {
        util.colors.green('File ' + event.type + ': ') +
        util.colors.magenta(path.basename(event.path));
    });
});



//"use strict";

/*
var gulp = require("gulp"),
    path = require("path"),
    util = require("gulp-util");

gulp.task("watch", function() {*/
    //gulp.watch("**/*").on("change", logChanges);
    
   //gulp.watch([global.paths.javascript], ["javascript"]).on("change", logChanges); 
   //gulp.watch([global.paths.html], ["html"]).on("change", logChanges); 
/*});

function logChanges(event) {
  util.log(
    util.colors.green('File ' + event.type + ': ') +
    util.colors.magenta(path.basename(event.path))
  );
}*/