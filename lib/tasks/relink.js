'use strict';

const path = require( 'path' );
const del = require( 'del' );
const fs = require( 'fs' );
const utils = require( '../utils' );
const gutil = require( 'gulp-util' );

module.exports = ( config ) => {
	/**
	 * Tasks definitions.
	 */
	return {
		relink( done ) {
			const packageJSON = require( path.join( config.ROOT_PATH, 'package.json' ) );

			const dependencies = [];

			for ( let dependency in packageJSON.devDependencies ) {
				if ( dependency.startsWith( 'battleships-' ) && !dependency.startsWith( 'battleships-dev-' ) ) {
					dependencies.push( dependency );
				}
			}

			for ( let dependency in packageJSON.dependencies ) {
				if ( dependency.startsWith( 'battleships-' ) && !dependency.startsWith( 'battleships-dev-' ) ) {
					dependencies.push( dependency );
				}
			}

			dependencies.forEach( ( dependency ) => {
				const dependencyPath = path.join( 'node_modules', dependency );

				if ( isSymlink( dependencyPath ) ) {
					fs.unlinkSync( dependencyPath );
				} else {
					utils.shExec( `rm -rf ${ dependencyPath }` );
				}

				const src = path.join( config.ROOT_PATH, '..', dependency );
				const dest = path.join( config.ROOT_PATH, 'node_modules', dependency );

				fs.symlinkSync( src, dest, 'dir' );
				gutil.log( dependency );
			} );

			done();
		}
	};
};

/**
 * Returns true if path points to symbolic link.
 *
 * @param {String} path
 */
function isSymlink( path ) {
	try {
		return fs.lstatSync( path ).isSymbolicLink();
	} catch ( e ) {}

	return false;
}
