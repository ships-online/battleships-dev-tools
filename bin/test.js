#!/usr/bin/env node

'use strict';

const KarmaServer = require( 'karma' ).Server;
const getKarmaConfig = require( '../lib/utils/karma.conf.js' );
const parseArguments = require( '../lib/utils/parsearguments.js' );
const minimist = require( 'minimist' );

// Parse test options.
const testOptions = minimist( process.argv.slice( 2 ), {
	string: [
		'files'
	],

	boolean: [
		'coverage'
	],

	alias: {
		f: 'files',
		c: 'coverage'
	},

	default: {
		files: [ 'tests/' ]
	}
} );

if ( typeof testOptions.files === 'string' ) {
	testOptions.files = testOptions.files.split( ',' );
}

// Merge test options with global options.
const options = Object.assign( parseArguments( process.argv.slice( 2 ) ), testOptions );

// Create Karma server.
const server = new KarmaServer( getKarmaConfig( options ), exitCode => {
	if ( exitCode !== 0 ) {
		process.exit( exitCode );
	}
} );

// And go :)
server.start();
