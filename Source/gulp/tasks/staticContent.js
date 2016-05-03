import gulp from "gulp";
import config from "../config";

export function staticContentPipeline(stream) {
    stream.pipe(gulp.dest(config.paths.dist));
    return stream;
}

gulp.task("staticContent", () => {
    var stream = gulp.src(config.paths.content);
    staticContentPipeline(stream);
    return stream;
});
