'use strict';

const KarmaServer = require( 'karma' ).Server;
const getKarmaConfig = require( '../utils/karma.conf.js' );

module.exports = function test( options ) {
	if ( typeof options.files === 'string' ) {
		options.files = options.files.split( ',' );
	}

	if ( options.coverage ) {
		options.sourceMap = true;
	}

	const server = new KarmaServer( getKarmaConfig( options ), exitCode => {
		if ( exitCode !== 0 ) {
			process.exit( exitCode );
		}
	} );

	return server.start();
};
