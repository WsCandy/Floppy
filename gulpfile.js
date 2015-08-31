// Use the config!!!
var options = {

		'assetsPath' : 'app/assets/',
		'viewsPath' : 'app/views/'

	},
	legacy,
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	minifyCss = require('gulp-minify-css'),
	fs = require('fs'),
	path = require('path'),
	browserSync = require('browser-sync').create(),
	opn = require('opn'),
	critical = require('critical'),
    minifyHTML = require('gulp-minify-html'),
	jsFiles;

var scriptsTask = function() {

	if(legacy === true) {

		gutil.log(gutil.colors.red('Legacy JS structure detected, aborting concatination and minification, Ant will take care of it all!'));			
		return;

	}

	gutil.log(gutil.colors.yellow('Concatenating and minifying JS to '+options.assetsPath+'js/main.min.js'));

	gulp.src(jsFiles)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.on('error', function(err){

			var filePath = err.fileName.split('/');

			gutil.log(gutil.colors.red(err.message))
			gutil.log(gutil.colors.red('Line: '+err.lineNumber))
			gutil.log(gutil.colors.red('JS not compiled...!'))

			browserSync.notify('You appear to have a JS error, try line: ' + err.lineNumber + ' in ' + filePath[filePath.length -2] + '/' + filePath[filePath.length -1] + '. Check your terminal for full details.', 60000);

		})
		.pipe(concat('main.min.js'))
		.on('end', function() {

			browserSync.reload(options.assetsPath+'js/main.min.js');

		})
		.on('error', gutil.log)
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(options.assetsPath+'js/'));

}

var sassTask = function() {

	gutil.log(gutil.colors.yellow('Writing CSS to '+options.assetsPath+'css and generating a CSS map...'));

	gulp.src(options.assetsPath+'sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
		
			includePaths : [options.assetsPath+'css/'],
			onSuccess: function(data) {

				gutil.log(gutil.colors.green('SASS successfully written! Amazing!'));
				browserSync.reload(options.assetsPath+'css/main.css');

			},
			onError: function(err) {

				var filePath = err.file.split('/');

				gutil.log(gutil.colors.red(err.file))
				gutil.log(gutil.colors.red('Line: ' + err.line, 'Col: ' + err.column + ' - ' + err.message))
				gutil.log(gutil.colors.red('SASS not compiled...!'))

				browserSync.notify('You appear to have a CSS error, try line: ' + err.line + ' of ' + filePath[filePath.length -2] + '/' + filePath[filePath.length -1] + '. Check your terminal for full details.', 60000);

			}

		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest(options.assetsPath+'css/'))
		.on('error', gutil.log);
}

var reloadFile = function(data) {

	browserSync.reload(data.path);

}

var watchTask = function() {

	gulp.watch(options.assetsPath+'sass/**/*.scss', ['sass']);
	gulp.watch(options.viewsPath+'**/*.html').on('change', reloadFile);

	if(legacy !== true) {

		gulp.watch(jsFiles, ['scripts']);
		
	}

}

gulp.task('setup', function() {

	fs.stat(options.assetsPath+'js/src/script.js', function(err, data) {

		legacy = (data ? true : false);
	
	});

	fs.readFile(process.env.PWD+'/gulp_config.json', 'utf8', function(err, data) {

		var settings = !err ? JSON.parse(data) : options;

		for(var key in settings) {

			options[key] = settings[key];
			options[key] = process.env.PWD + '/' + options[key];

		}

		jsFiles = [options.assetsPath+'js/lib/*.js', options.assetsPath+'js/src/*.js'];

		fs.unlink(options.assetsPath+'js/main.min.js', function(err){});
		fs.unlink(options.assetsPath+'css/main.css', function(err){});

		gulp.start('sass');
		gulp.start('scripts');

		if(process.env.NODE_ENV !== 'production') {

			gulp.start('watch');
			
		}

	});

});

gulp.task('browser-sync', function() {

	var version = process.env.PWD.split('/');
	
    browserSync.init({

		logFileChanges: false,
		reloadOnRestart: true,
		logPrefix: 'Propeller Browser Sync',
    	proxy: {
		
		    target: 'http://localhost:4200',
		    middleware: function(req, res, next) {
		    	
		    	next();
		    }

		},
		open: false

    });

    setTimeout(function() {

    	opn('http://project.node')

    }, 400);

});

gulp.task('html', function() {
    
  var opts = {
      
    conditionals: true,
    cdata: true,
    loose: true
      
  };
 
  return gulp.src(options.viewsPath+'**/*.html')
  
    .pipe(minifyHTML(opts))  
    .pipe(gulp.dest(options.viewsPath));
    
});


gulp.task('sass', sassTask);
gulp.task('scripts', scriptsTask);
gulp.task('watch', watchTask);

gulp.task('critical', function () {

	critical.generateInline({

        base: process.env.PWD,
        src: options.viewsPath+'templates/template.html',
        styleTarget: options.assetsPath+'css/critical.css',
        ignore: ['@font-face'],
        minify: true,
        width: 1920,
        height: 985

    });

});

gulp.task('default', ['setup', 'browser-sync']);