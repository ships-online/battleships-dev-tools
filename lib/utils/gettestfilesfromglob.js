'use strict';

const path = require( 'path' );
const glob = require( 'glob' );

module.exports = function getTestFilesFromGlob( globs ) {
	let files = [];

	for ( let file of globs ) {
		if ( !file.endsWith( '.js' ) ) {
			file = path.join( file, '**', '*.js' );
		}

		file = path.join( process.cwd(), file );
		files = files.concat( glob.sync( file ) );
	}

	return files.filter( file => !file.includes( '/_utils/' ) );
};
