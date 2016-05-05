var buildDir = "public";
var source = "Source"

export default {
    paths: {
        appFile: "./"+source+"/app.js",
        
        source: source,
        html: [
            "!./**/jspm_packages/**/*",
            "!./**/node_modules/**/*",
            "!./**/bower_components/**/*",
            "!"+buildDir+"/**/*",
            source+"/**/*.html",
        ],

        javascript: [
            "!./**/jspm_packages/**/*",
            "!./**/node_modules/**/*",
            "!./**/bower_components/**/*",
            "!"+buildDir+"/**/*",
            "!gulpfile.js",
            "!gulp/**/*",
            "config.js",
            source+"/**/*.js"
        ],

        less: [
            "!./**/jspm_packages/**/*",
            "!./**/bower_components/**/*",
            "!./**/node_modules/**/*",
            "!"+buildDir+"/**/*",
            source+"/**/*.less"
        ],
        
        content: [
            source+"/**/*.gif",
            source+"/**/*.jpg",
            source+"/**/*.jpeg",
            source+"/**/*.png",
            source+"/**/*.woff*",
            source+"/**/*.ttf",
            source+"/**/*.svg",
            source+"/**/*.eot"
        ],

        dist: "./"+buildDir,
    }
}