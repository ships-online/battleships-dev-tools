'use strict';

module.exports = config => {
	/**
	 * Build.
	 *
	 * @param {Object} options Output configuration.
	 * @returns {Promise}
	 */
	return function build( options ) {
		const gutil = require( 'gulp-util' );
		const webpack = require( 'webpack' );
		const getWebpackConfig = require( '../webpack.conf.js' );

		return new Promise( ( resolve, reject ) => {
			const webpackConfig = getWebpackConfig( config, options );

			webpack( webpackConfig, ( err, stats ) => {
				if ( err ) {
					reject( err );
				}

				gutil.log( stats.toString() );

				resolve();
			} );
		} );
	};
};
