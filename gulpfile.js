'use strict';

const config = {
	ROOT_PATH: __dirname
};

const gulp = require( 'gulp' );
const lintTasks = require( './lib/tasks/lint.js' )( config );

gulp.task( 'lint', lintTasks.lint );
gulp.task( 'pre-commit', lintTasks.lintStaged );
