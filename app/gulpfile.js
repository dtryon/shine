var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	jest = require('gulp-jest');

require('harmonize')()
	
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

gulp.task('jest', function() {
	return gulp.src('__tests__').pipe(jest({
        rootDir: "./",
        scriptPreprocessor: "test-support/test-preprocessor.js",
        unmockedModulePathPatterns: [
            "node_modules/react"
        ],
        modulePathIgnorePatterns: [
            "node_modules/gulp",
            "node_modules/gulp-jest",
            "node_modules/gulp-nodemon",
            "node_modules/express",
            "node_modules/bower"
        ],
        testPathIgnorePatterns: [
            "node_modules",
            "test-support"
        ],
        moduleFileExtensions: [
            "js",
            "json",
            "react"
        ]
    }));
});
