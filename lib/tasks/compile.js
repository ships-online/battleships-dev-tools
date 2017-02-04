'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const utils = require( '../utils.js' );
const gutil = require( 'gulp-util' );
const gulpBabel = require( 'gulp-babel' );
const gulpPrint = require( 'gulp-print' );
const gulpReplace = require( 'gulp-replace' );
const gulpSass = require( 'gulp-sass' );
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

			const ckePrefix = `@ckeditor/ckeditor5-`;
			const battleshipsPrefix = `battleships-`;

			return gulp.src( path.join( sourcePath, '**', '*.js' ), { base: sourcePath } )
				.pipe( gulpReplace( ` from '${ battleshipsPrefix }`, ` from '${ options.relativeTo }${ battleshipsPrefix }` ) )
				.pipe( gulpReplace( ` from '${ ckePrefix }`, ` from '${ options.relativeTo }${ ckePrefix }` ) )
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

		compileGame( outputOptions, additionalOptions = {} ) {
			return new Promise( () => {
				const webpackConfig = getWebpackConfig( config, {
					inputPath: path.join( getDependencyPath( 'battleships-core' ), 'src', 'umd.js' ),
					outputPath: path.join( config.ROOT_PATH, outputOptions.destination, outputOptions.fileName ),
					watch: additionalOptions.watch
				} );

				return Promise.all(
					outputOptions.themes.map( ( themeName ) => {
						return buildTheme( themeName, outputOptions.destination );
					} ).concat( [ buildJS( webpackConfig ) ] )
				);
			} );
		}
	};

	return tasks;

	function getDependencyPath( dependencyName ) {
		return path.join( config.ROOT_PATH, 'node_modules', dependencyName );
	}

	function buildJS( config ) {
		return new Promise( ( resolve, reject ) => {
			webpack( config, ( err, stats ) => {
				if ( err ) {
					reject( err );
				}

				gutil.log( stats.toString() );

				resolve();
			} );
		} );
	}

	function buildTheme( themeName, destination ) {
		return gulp.src( path.join( getDependencyPath( `battleships-theme-${ themeName }` ), 'src', 'styles', '*.scss' ) )
			.pipe( gulpSass.sync().on( 'error', gulpSass.logError) )
			.pipe( gulp.dest( path.join( destination, 'themes', themeName ) ) );
	}
};
