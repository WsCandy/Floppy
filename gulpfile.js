var gulp = require('gulp'),
    floeGulp = require('./floe-gulp/gulpfile.js');

gulp.task('default', () => {
    
    floeGulp.init(gulp);
    
});
