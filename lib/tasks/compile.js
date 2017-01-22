'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const utils = require( '../utils.js' );
const gutil = require( 'gulp-util' );
const gulpBabel = require( 'gulp-babel' );
const gulpPrint = require( 'gulp-print' );
const gulpReplace = require( 'gulp-replace' );
const webpack = require( 'webpack' );
const getWebpackConfig = require( '../webpack.conf.js' );

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
		 * @param {Object} [options] Output format.
		 * @param {'esnext'|'cjs'} [options.format='esnext'] Output format.
		 * @returns {Stream}
		 */
		build( source, destination, options = {} ) {
			const sourcePath = path.join( config.ROOT_PATH, source );
			const plugins = [];

			if ( options.format == 'cjs' ) {
				plugins.push( [ 'babel-plugin-transform-es2015-modules-commonjs' ] );
			} else if ( options.format && options.format != 'esnext' ) {
				throw new Error( 'Unsupported format.' );
			}

			options.relativeTo = options.relativeTo || '';

			return gulp.src( path.join( sourcePath, '**', '*.js' ), { base: sourcePath } )
				.pipe( gulpReplace( ` from 'battleships-`, ` from '${ options.relativeTo }battleships-` ) )
				.pipe( gulpBabel( { plugins } ) )
				.pipe( gulpPrint() )
				.pipe( gulp.dest( destination ) );
		},

		buildDependency( name, options = {} ) {
			const source = path.join( '.', 'node_modules', `battleships-${ name }` );
			const destination = options.destination || path.join( '.', 'lib', name );

			utils.del.sync( path.join( config.ROOT_PATH, destination ) );

			return tasks.build( source, destination, options );
		},

		compileGame( destination, options = {} ) {
			return new Promise( ( resolve, reject ) => {
				const webpackConfig = getWebpackConfig( config, {
					inputPath: path.join( config.ROOT_PATH, 'node_modules', 'battleships-core', 'src', 'umd.js' ),
					outputPath: path.join( config.ROOT_PATH, destination ),
					watch: options.watch
				} );

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
