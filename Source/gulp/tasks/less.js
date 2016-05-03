import gulp from "gulp";
import config from "../config";

import less from "gulp-less";


export function lessPipeline(stream) {
    stream
        .pipe(less())
        .pipe(gulp.dest(config.paths.dist));
    return stream;
}

gulp.task("less", () => {
    var stream = gulp.src(config.paths.less);
    lessPipeline(stream);
    return stream;
});
