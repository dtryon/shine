var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');
	
gulp.task('default', function() {
    
    console.log('default task is running');
});

gulp.task('serve', function() {
	nodemon({
    script: 'test-server.js', 
    ext: 'js html', 
    env: { 'NODE_ENV': 'development' }
  })
});
