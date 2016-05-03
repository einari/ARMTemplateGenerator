import gulp from "gulp";
import path from "path";
import util from "gulp-util";
import config from "../config";
import server from "gulp-express";

import {javaScriptPipeline} from "./javascript";
import {htmlPipeline} from "./html";

import gulpmatch from "gulp-match";

function handleEvent(event, pipeline) {
    util.log(
        util.colors.green('File ' + event.type + ': ') +
        util.colors.magenta(path.basename(event.path))
    );
    
    if( event.type == "deleted" ) {
        
    }

    var stream = gulp.src(event.path);
    pipeline(stream);
    
    server.stop();
    //server.notify();
    server.run([config.paths.dist+"/main.js"]);
}

console.log("Watcher going...");
gulp.task("watch", () => {
    console.log("Watch");

    gulp.watch(config.paths.html).on("change", (event) => {
        handleEvent(event, htmlPipeline);
    });

    gulp.watch(config.paths.javascript).on("change", (event) => {
        handleEvent(event, javaScriptPipeline);
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