'use strict';

const path = require( 'path' );
const fs = require( 'fs' );
const gulp = require( 'gulp' );
const gulpFilter = require( 'gulp-filter' );
const gulpEslint = require( 'gulp-eslint' );

module.exports = ( config ) => {
	const src = [ '**/*.js' ].concat( getIgnoredFiles() );

	/**
	 * Tasks definitions.
	 */
	return {
		/**
		 * Analyzes quality and code style of JS files.
		 *
		 * @returns {Stream}
		 */
		lint() {
			return gulp.src( src )
				.pipe( gulpEslint() )
				.pipe( gulpEslint.format() )
				.pipe( gulpEslint.failAfterError() );
		},

		/**
		 * Lints staged files - pre commit hook.
		 *
		 * @returns {Stream}
		 */
		lintStaged() {
			const guppy = require( 'git-guppy' )( gulp );

			return guppy.stream( 'pre-commit', { base: './' } )
				.pipe( gulpFilter( src ) )
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
	function getIgnoredFiles() {
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
