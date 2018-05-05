'use strict';

const KarmaServer = require( 'karma' ).Server;
const getKarmaConfig = require( '../lib/utils/karma.conf.js' );

module.exports = function test( options ) {
	if ( typeof options.files === 'string' ) {
		options.files = options.files.split( ',' );
	}

	const server = new KarmaServer( getKarmaConfig( options ), exitCode => {
		if ( exitCode !== 0 ) {
			process.exit( exitCode );
		}
	} );

	return server.start();
};
