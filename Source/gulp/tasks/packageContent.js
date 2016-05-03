import gulp from "gulp";
import config from "../config";

gulp.task("packageContent", () => {
    gulp.src("./bower_components/**/*")
        .pipe(gulp.dest(config.paths.dist+"/bower_components"));
        
    gulp.src("./jspm_packages/**/*")
        .pipe(gulp.dest(config.paths.dist+"/jspm_packages"));
});
