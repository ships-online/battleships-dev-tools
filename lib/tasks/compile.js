'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const utils = require( '../utils.js' );
const gutil = require( 'gulp-util' );
const gulpBabel = require( 'gulp-babel' );
const gulpPrint = require( 'gulp-print' );
const gulpReplace = require( 'gulp-replace' );
const mergeStream = require( 'merge-stream' );
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

			if ( !options.relativeTo ) {
				options.relativeTo = 'lib'
			}

			return gulp.src( path.join( sourcePath, '**', '*.js' ), { base: sourcePath } )
				.pipe( gulpBabel( { plugins } ) )
				.pipe( gulpReplace( `from 'lib\/`, `from '${ options.relativeTo }/` ) )
				.pipe( gulpPrint() )
				.pipe( gulp.dest( destination ) );
		},

		buildDependency( name, options = {} ) {
			const source = path.join( '.', 'node_modules', `battleships-${ name }`, 'src' );
			const destination = options.destination || path.join( '.', 'lib', name );

			utils.del.sync( path.join( config.ROOT_PATH, destination ) );

			return tasks.build( source, destination, options );
		},

		/**
		 * @param {String} destination Destination path.
		 * @param {Object} [options] Output format.
		 * @param {'esnext'|'cjs'} [options.format='esnext'] Output format.
		 * @returns {Stream}
		 */
		buildGame( destination, options = {} ) {
			const fullDestPath = path.join( config.ROOT_PATH, destination );

			options.relativeTo = destination;

			return mergeStream(
				tasks.build( 'node_modules/battleships-utils/src', path.join( fullDestPath, 'utils' ), options ),
				tasks.build( 'node_modules/battleships-engine/src', path.join( fullDestPath, 'engine' ), options ),
				tasks.build( 'node_modules/battleships-core/src', fullDestPath, options )
			);
		},

		compileGame( destination ) {
			return new Promise( ( resolve, reject ) => {
				const tmpBuildPath = path.join( '.build', 'battleships' );
				const stream = tasks.buildGame( tmpBuildPath );

				stream
					.on( 'end', () => {
						const webpackConfig = getWebpackConfig( config, {
							inputPath: path.join( config.ROOT_PATH, tmpBuildPath, 'umd.js' ),
							outputPath: path.join( config.ROOT_PATH, destination )
						} );

						webpack( webpackConfig, ( err, stats ) => {
							if ( err ) {
								reject( err );
							}

							gutil.log( stats.toString() );
							utils.del.sync( path.join( config.ROOT_PATH, '.build' ) );

							resolve();
						} );
					} )
					.resume();
			} );
		}
	};

	return tasks;
};
