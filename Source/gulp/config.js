var buildDir = "www/";

export default {
    paths: {
        appFile: "./app.js",
        html: [
            "!jspm_packages/**/*",
            "!node_modules/**/*",
            "!"+buildDir+"/**/*",
            "**/*.html"
        ],

        javascript: [
            "!jspm_packages/**/*",
            "!node_modules/**/*",
            "!"+buildDir+"/**/*",
            "!config.js",
            "!gulpfile.js",
            "!build/**/*",
            "!gulp/**/*",
            "**/*.js"
        ],

        less: [
            "!jspm_packages/**/*",
            "!node_modules/**/*",
            "!"+buildDir+"/**/*",
            "**/*.less"
        ],

        dist: "./"+buildDir
    }
}