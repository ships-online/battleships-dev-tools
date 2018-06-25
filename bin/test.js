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
		'watch',
		'sourceMap'
	],

	alias: {
		f: 'files',
		c: 'coverage',
		w: 'watch',
		s: 'sourceMap'
	},

	default: {
		files: [ 'tests/' ],
		watch: false,
		coverage: false,
		'sourceMap': false
	}
} );

test( options );
