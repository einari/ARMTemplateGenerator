var buildDir = "www/";
var source = "source"

export default {
    paths: {
        appFile: "./"+source+"/app.js",
        
        source: source,
        html: [
            "!jspm_packages/**/*",
            "!node_modules/**/*",
            "!"+buildDir+"/**/*",
            source+"/**/*.html"
        ],

        javascript: [
            "!jspm_packages/**/*",
            "!node_modules/**/*",
            "!"+buildDir+"/**/*",
            "!gulpfile.js",
            "!gulp/**/*",
            "config.js",
            source+"/**/*.js"
        ],

        less: [
            "!jspm_packages/**/*",
            "!node_modules/**/*",
            "!"+buildDir+"/**/*",
            source+"/**/*.less"
        ],

        dist: "./"+buildDir
    }
}