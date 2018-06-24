#!/usr/bin/env node

'use strict';

const minimist = require( 'minimist' );
const test = require( '../lib/tasks/test.js' );

// Parse test options.
const options = minimist( process.argv.slice( 2 ), {
	string: [
		'files',
		'config'
	],

	boolean: [
		'coverage',
		'watch'
	],

	alias: {
		f: 'files',
		c: 'coverage',
		w: 'watch'
	},

	default: {
		files: [ 'tests/' ],
		watch: false,
		coverage: false
	}
} );

test( options );
