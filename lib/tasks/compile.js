'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
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
		 * @param {Object} [options={}] Additional options.
		 * @param {'esnext'|'cjs'} [options.format='esnext'] Output format.
		 * @param {String} [options.relativeTo] Modifies import paths relative to given path.
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
		 * Compiles game source files including selected themes.
		 *
		 * @param {Object} outputOptions Output configuration.
		 * @param {String} [outputOptions.destination] Destination path.
		 * @param {String} [outputOptions.fileName] File name.
		 * @param {Array<String>} [outputOptions.themes] List of themes.
		 * @param {Object} additionalOptions Additional options.
		 * @param {Boolean} [additionalOptions.watch] Watch files and recompile on change.
		 * @returns {Promise}
		 */
		compileGame( outputOptions, additionalOptions = {} ) {
			return new Promise( () => {
				const webpackConfig = getWebpackConfig( config, {
					inputPath: path.join( getDependencyPath( 'battleships-core' ), 'src', 'umd.js' ),
					outputPath: path.join( config.ROOT_PATH, outputOptions.destination, outputOptions.fileName ),
					watch: additionalOptions.watch
				} );

				const promises = [
					bundleJS( webpackConfig ),
					buildTheme( outputOptions.theme, outputOptions.destination )
				];

				if ( additionalOptions.watch ) {
					const themePath = getDependencyPath( `battleships-theme-${ outputOptions.theme }` );
					const taskName = `_buildTheme-${ outputOptions.theme }`;

					gulp.task( taskName, () => buildTheme( outputOptions.theme, outputOptions.destination ) );
					gulp.watch( path.join( themePath, 'src', '**', '*.scss' ), [ taskName ] );
				}

				return Promise.all( promises );
			} );
		}
	};

	return tasks;

	/**
	 * Returns full path to given dependency.
	 *
	 * @param {String} dependencyName Dependency name without `battleships-` prefix.
	 * @returns {String} Full path.
	 */
	function getDependencyPath( dependencyName ) {
		return path.join( config.ROOT_PATH, 'node_modules', dependencyName );
	}

	/**
	 * Bundles js files bu webpack.
	 *
	 * @param {Object} config Webpack configuration.
	 * @returns {Promise}
	 */
	function bundleJS( config ) {
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

	/**
	 * Builds theme.
	 *
	 * @param {String} themeName theme name without `battleships-` prefix.
	 * @param {String} destination Destination path.
	 * @returns {Stream}
	 */
	function buildTheme( themeName, destination ) {
		return gulp.src( path.join( getDependencyPath( `battleships-theme-${ themeName }` ), 'src', 'styles', '*.scss' ) )
			.pipe( gulpSass.sync().on( 'error', gulpSass.logError ) )
			.pipe( gulp.dest( path.join( destination, 'theme' ) ) );
	}
};
