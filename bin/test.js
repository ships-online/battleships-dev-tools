#!/usr/bin/env node

'use strict';

const minimist = require( 'minimist' );
const test = require( '../lib/tasks/test.js' );

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

test( options );
