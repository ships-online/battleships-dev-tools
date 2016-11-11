'use strict';

const gulp = require( 'gulp' );
const gulpBabel = require( 'gulp-babel' );
const path = require( 'path' );
const gulpPrint = require( 'gulp-print' );

module.exports = ( config ) => {
	/**
	 * Tasks definition.
	 */
	return {
		/**
		 * Compiles source files to specified format.
		 *
		 * @param {String} source Source path.
		 * @param {String} destination Destination path.
		 * @param {'esnext'|'cjs'} format Output format.
		 * @returns {Stream}
		 */
		compile( source, destination, format = 'esnext' ) {
			const sourcePath = path.join( config.ROOT_PATH, source );
			const plugins = [];

			if ( format == 'cjs' ) {
				plugins.push( [ 'babel-plugin-transform-es2015-modules-commonjs' ] );
			} else if ( format != 'esnext' ) {
				throw new Error( 'Unsupported format.' );
			}

			return gulp.src( path.join( sourcePath, '**', '*.js' ), { base: sourcePath } )
				.pipe( gulpBabel( { plugins } ) )
				.pipe( gulpPrint() )
				.pipe( gulp.dest( destination ) );
		}
	};
};
