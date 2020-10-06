// package vars
const pkg = require("./package.json");

// gulp
const gulp = require("gulp");

// load all plugins in "devDependencies" into the variable $
const $ = require("gulp-load-plugins")({
    pattern: ["*"],
    scope: ["devDependencies"]
});

const onError = (err) => {
    console.log(err);
};


// Default task
gulp.task("default", () => {
  $.livereload.listen();
  gulp.watch([pkg.paths.src.css + "**/*.css"], ["css"]);
  gulp.watch([pkg.paths.src.js + "**/*.js"], ["js"]);
  gulp.watch([pkg.paths.templates + "*.html"], () => {
    gulp.src(pkg.paths.templates)
      .pipe($.plumber({errorHandler: onError}))
      .pipe($.livereload());
  });
});


// Compress CSS
gulp.task('css', () => {
  $.fancyLog("✨ 🍕 ✨ CSS ✨ 🍕 ✨");
  return gulp.src([pkg.paths.src.css + "**/*.css"])
    .pipe(
        $.postcss([
          require('tailwindcss'),
          require('autoprefixer'),
          require('postcss-preset-env')({
              stage: 1,
              browsers: ['IE 11', 'last 2 versions']
          })
        ])
    )
    .pipe($.cleanCss({debug: true, level: {1: {specialComments: 0}}}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe($.concat("styles.min.css"))
    .pipe(gulp.dest(pkg.paths.dist.css));
});


// Compress JS
gulp.task('js', () => {
  $.fancyLog("✨ 🍕 ✨ JS ✨ 🍕 ✨");
  return gulp.src([pkg.paths.src.js + "**/*.js"])
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.concat("scripts.min.js"))
    .pipe(gulp.dest(pkg.paths.dist.js));
});



// PurgeCSS — STILL TO GET WORKING
gulp.task('purgecss', () => {
  $.fancyLog("🐷 TIME TO SLIM 🐷");
  return gulp
    .src('./css/styles.min.css')
    .pipe(
      $.purgecss({
        // // Files you want to scan for class names.
        content: pkg.globs.purgecss,
        whitelist: pkg.globs.purgecssWhitelist
      })
    )
    .pipe($.concat("styles-slimmed.min.css"))
    .pipe(gulp.dest('./css/'))
})