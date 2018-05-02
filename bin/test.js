#!/usr/bin/env node

'use strict';

const KarmaServer = require( 'karma' ).Server;
const getKarmaConfig = require( '../lib/utils/karma.conf.js' );
const minimist = require( 'minimist' );

// Parse test options.
const options = minimist( process.argv.slice( 2 ), {
	string: [
		'files'
	],

	boolean: [
		'coverage',
		'watch',
		'source-map'
	],

	alias: {
		f: 'files',
		c: 'coverage',
		w: 'watch',
		s: 'source-map'
	},

	default: {
		files: [ 'tests/' ],
		watch: false,
		coverage: false,
		'source-map': false
	}
} );

if ( typeof options.files === 'string' ) {
	options.files = options.files.split( ',' );
}

// Create Karma server.
const server = new KarmaServer( getKarmaConfig( options ), exitCode => {
	if ( exitCode !== 0 ) {
		process.exit( exitCode );
	}
} );

// And go :)
server.start();
