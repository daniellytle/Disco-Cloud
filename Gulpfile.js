
// Gulpfile.js
var gulp = require('gulp'), 

	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify');

gulp.task("scripts", function() {
	return gulp.src('public/js/**/*.js')
	.pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest("build/min/"))
    .pipe(notify({message: "all done brah"}));
})