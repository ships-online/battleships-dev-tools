'use strict';

module.exports = ( config ) => {
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

			new KarmaServer( getKarmaConfig( config, options ), ( exitCode ) => {
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
			const gulp = require( 'gulp' );
			const gulpMocha = require( 'gulp-mocha' );
			const gulpIstanbul = require( 'gulp-istanbul' );
			const files = options.files ? options.files : 'tests/**/*.js';

			if ( !options.coverage ) {
				return gulp.src( files )
					.pipe( gulpMocha() );
			}

			return gulp.src( [ 'src/**/*.js' ] )
				.pipe( gulpIstanbul( { includeUntested: true } ) )
				.pipe( gulpIstanbul.hookRequire() )
				.on( 'finish', () => {
					gulp.src( files )
						.pipe( gulpMocha() )
						.pipe( gulpIstanbul.writeReports( {
							dir: './coverage',
							reporters: [ 'lcov', 'text-summary' ],
							reportOpts: { dir: './coverage' }
						} ) )
				} );
		}
	};
};
