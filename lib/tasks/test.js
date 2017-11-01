'use strict';

module.exports = config => {
	/**
	 * Runs Karma JS unit tests.
	 *
	 * @param {Function} done Finish callback.
	 * @param {Object} [options={}] Additional options.
	 * @param {Boolean} [options.coverage] When `true` then coverage report will be generated.
	 * @param {String} [options.files] Glob with selected for test files.
	 */
	return function test( options, done ) {
		const KarmaServer = require( 'karma' ).Server;
		const getKarmaConfig = require( '../karma.conf.js' );

		new KarmaServer( getKarmaConfig( config, options ), exitCode => {
			done( exitCode );
		} ).start();
	};
};
