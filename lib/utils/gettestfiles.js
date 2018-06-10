'use strict';

const path = require( 'path' );
const glob = require( 'glob' );

// Using this helpers makes it possible to test specified by glob files
// and shows coverage only for currently tested files (including files without a corresponding test file).

function getTestFilesFromGlob( globs ) {
	let files = [];

	for ( let g of globs ) {
		if ( !g.endsWith( '.js' ) ) {
			g = path.join( g, '**', '*.js' );
		}

		g = path.join( process.cwd(), g );
		files = files.concat( glob.sync( g ) );
	}

	return files.filter( file => !file.includes( '/_utils/' ) );
}

function getSourceFilesFromGlob( globs ) {
	let files = [];

	for ( let g of globs ) {
		if ( !g.endsWith( '.js' ) ) {
			g = path.join( g, '**', '*.*(js|vue)' );
		}

		g = path.join( process.cwd(), g );

		if ( g.includes( '/_utils-tests/' ) ) {
			g = g.replace( '/_utils-tests/', '/_utils/' );
		} else {
			g = g.replace( '/tests/', '/src/' );
		}

		if ( g.endsWith( '.js' ) ) {
			files = files.concat( glob.sync( g.replace( /\.js$/, '.vue' ) ) );
		}

		files = files.concat( glob.sync( g ) );
	}

	return files.map( g => g.replace( '/_utils-tests/', '/_utils/' ) );
}

module.exports = { getTestFilesFromGlob, getSourceFilesFromGlob };
