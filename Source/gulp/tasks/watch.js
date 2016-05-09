import gulp from "gulp";
import path from "path";
import util from "gulp-util";
import config from "../config";
import server from "gulp-express";

import {javaScriptPipeline} from "./javascript";
import {htmlPipeline} from "./html";
import {lessPipeline} from "./less";
import {contentPipeline} from "./staticContent";

import chokidar from "chokidar";

import multimatch from "multimatch";

import pkg from "../../package.json";

let serve = true;

function handleFile(file, globs, pipeline) {
    var result = multimatch(file, globs);
    if (result.length == 0) return;

    util.log(
        util.colors.green('File ' + file + ': ') +
        util.colors.magenta(path.basename(file))
    );

    try {
        var stream = gulp.src(file, {base:config.paths.base});
        pipeline(stream);

        if( serve ) {
            server.stop();
            server.run([pkg.main]);
        }
    } catch (ex) {
        util.log(ex);
    }
}

console.log("Watcher going...");

let watchTask = () => {
    console.log("Watch");

    let watcher = chokidar.watch(".", {
        persistent: true,
        ignored: "public/**/*",
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 100
        }
    });

    let fileHandling = (file) => {
        handleFile(file, config.paths.html, htmlPipeline);
        handleFile(file, config.paths.less, lessPipeline);
        handleFile(file, config.paths.content, contentPipeline);
        handleFile(file, config.paths.javascript, javaScriptPipeline);
    };

    watcher
        .on("change", fileHandling)
        .on("add", fileHandling)
        .on("unlink", (file) => {
            // delete
        });
};

gulp.task("watch-noserve", () => {
    serve = false;
    watchTask();
});

gulp.task("watch", watchTask);
