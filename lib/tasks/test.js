'use strict';

module.exports = config => {
	/**
	 * Tasks definitions.
	 */
	return {
		/**
		 * Runs Karma JS unit tests.
		 *
		 * @param {Function} done Finish callback.
		 * @param {Object} [options={}] Additional options.
		 * @param {Boolean} [options.coverage] When `true` then coverage report will be generated.
		 * @param {String} [options.files] Glob with selected for test files.
		 */
		test( options, done ) {
			const KarmaServer = require( 'karma' ).Server;
			const getKarmaConfig = require( '../karma.conf.js' );

			new KarmaServer( getKarmaConfig( config, options ), exitCode => {
				done( exitCode );
			} ).start();
		},

		/**
		 * Runs Node JS unit tests.
		 *
		 * @param {Object} [options={}] Additional options.
		 * @param {Boolean} [options.coverage] When `true` then coverage report will be generated.
		 * @param {String} [options.files] Glob with selected for test files.
		 * @returns {Stream}
		 */
		testNode( options ) {
			const path = require( 'path' );
			const gulp = require( 'gulp' );
			const gulpMocha = require( 'gulp-mocha' );
			const files = options.files.length ? options.files : [ path.join( 'tests', '**', '*.js' ) ];

			if ( !options.coverage ) {
				return gulp.src( files )
					.pipe( gulpMocha() );
			}

			const utils = require( '../utils' );
			const excluded = [ path.join( 'lib', '**' ), '*.js' ].map( file => `-x '${ file }'` );

			utils.shExec( `
				node_modules/.bin/istanbul cover --include-all-sources ${ excluded.join( ' ' ) }
				node_modules/.bin/_mocha -- -- '${ files.join( ',' ) }'
			` );

			return Promise.resolve();
		}
	};
};
