'use strict';

module.exports = ( config ) => {
	/**
	 * Tasks definition.
	 */
	const tasks = {
		/**
		 * Compiles source files to specified format.
		 *
		 * @param {String} source Source path.
		 * @param {String} destination Destination path.
		 * @param {Object} [options={}] Additional options.
		 * @param {'esnext'|'cjs'} [options.format='esnext'] Output format.
		 * @param {String} [options.relativeTo] Modifies import paths relative to given path.
		 * @returns {Stream}
		 */
		compile( source, destination, options = {} ) {
			const path = require( 'path' );
			const gulp = require( 'gulp' );
			const gulpPrint = require( 'gulp-print' );
			const gulpReplace = require( 'gulp-replace' );
			const gulpBabel = require( 'gulp-babel' );

			const sourcePath = path.join( config.ROOT_PATH, source );
			const plugins = [];

			if ( options.format == 'cjs' ) {
				plugins.push( [ 'babel-plugin-transform-es2015-modules-commonjs' ] );
			} else if ( options.format && options.format != 'esnext' ) {
				throw new Error( 'Unsupported format.' );
			}

			options.relativeTo = options.relativeTo || '';

			const ckePrefix = '@ckeditor/ckeditor5-';
			const battleshipsPrefix = 'battleships-';

			return gulp.src( path.join( sourcePath, '**', '*.js' ), { base: sourcePath } )
				.pipe( gulpReplace( ` from '${ battleshipsPrefix }`, ` from '${ options.relativeTo }${ battleshipsPrefix }` ) )
				.pipe( gulpReplace( ` from '${ ckePrefix }`, ` from '${ options.relativeTo }${ ckePrefix }` ) )
				.pipe( gulpBabel( { plugins } ) )
				.pipe( gulpPrint() )
				.pipe( gulp.dest( destination ) );
		},

		/**
		 * Build.
		 *
		 * @param {Object} options Output configuration.
		 * @returns {Promise}
		 */
		build( options ) {
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
		}
	};

	return tasks;
};
