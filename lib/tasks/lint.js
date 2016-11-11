'use strict';

const path = require( 'path' );
const fs = require( 'fs' );
const gulp = require( 'gulp' );
const gulpFilter = require( 'gulp-filter' );
const gulpEslint = require( 'gulp-eslint' );

module.exports = ( config ) => {
	/**
	 * Tasks definitions.
	 */
	return {
		/**
		 * Analyze quality and code style of JS files.
		 *
		 * @params {Array} files Files list.
		 * @returns {Stream}
		 */
		lint( files ) {
			const filesToLint = files.concat( getGitIgnore() );

			return gulp.src( filesToLint )
				.pipe( gulpEslint() )
				.pipe( gulpEslint.format() )
				.pipe( gulpEslint.failAfterError() );
		},

		/**
		 * Lints staged files - pre commit hook.
		 *
		 * @params {Array} files Files list.
		 * @returns {Stream}
		 */
		lintStaged( files ) {
			const filesToLint = files.concat( getGitIgnore( config ) );
			const guppy = require( 'git-guppy' )( gulp );

			return guppy.stream( 'pre-commit', { base: config.ROOT_PATH } )
				.pipe( gulpFilter( filesToLint ) )
				.pipe( gulpEslint() )
				.pipe( gulpEslint.format() )
				.pipe( gulpEslint.failAfterError() );
		}
	};

	/**
	 * Gets the list of ignores from `.gitignore`.
	 *
	 * @returns {Array<String>} The list of ignores.
	 */
	function getGitIgnore() {
		const gitIgnoredFiles = fs.readFileSync( path.join( config.ROOT_PATH, '.gitignore' ), 'utf8' );

		return gitIgnoredFiles
			// Remove comment lines.
			.replace( /^#.*$/gm, '' )
			// Transform into array.
			.split( /\n+/ )
			// Remove empty entries.
			.filter( ( path ) => !!path )
			// Add `!` for ignore glob.
			.map( i => '!' + i );
	}
};
