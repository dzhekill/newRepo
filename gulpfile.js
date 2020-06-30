let project_folder = "dist";
let source_folder = "#src";

let path = {
    build:{
        html : project_folder + "/",
        css : project_folder + "/css/",
        js : project_folder + "/js/",
        img : project_folder + "/img/",
        fonts : project_folder + "/fonts/",
    },
    src:{
        html : source_folder + "/*.html",
        css : source_folder + "/scss/style.scss",
        js : source_folder + "/js/script.js",
        img : source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
        fonts : source_folder + "/fonts/*.ttf",
    },
    watch:{
        html : source_folder + "/**/*.html",
        css : source_folder + "/scss/**/*.scss",
        js : source_folder + "/js/**/*.js",
        img : source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
    },
    clean: "./" + project_folder + "/"
}
let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browserSync = require("browser-sync").create(),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename");

function browsersync(param) {
    browserSync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html(){
    return src(path.src.html)
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function watchFiles(params){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
}
function css(){
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())

}

let build = gulp.series(gulp.parallel(html,css));
let watch= gulp.parallel(build, watchFiles, browsersync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;