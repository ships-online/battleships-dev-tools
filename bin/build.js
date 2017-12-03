#!/usr/bin/env node

'use strict';

const webpack = require( 'webpack' );
const getWebpackConfig = require( '../lib/utils/webpack.conf.js' );
const parseArguments = require( '../lib/utils/parsearguments' );
const minimist = require( 'minimist' );

// Parse build options.
const buildOptions = minimist( process.argv.slice( 2 ), {
	string: [
		'input',
		'output'
	],

	alias: {
		i: 'in',
		o: 'out'
	}
} );

if ( !buildOptions.input || !buildOptions.input.endsWith( '.js' ) ) {
	throw new Error( 'Invalid input format.' );
}

if ( !buildOptions.output || !buildOptions.output.endsWith( '.js' ) ) {
	throw new Error( 'Invalid output format.' );
}

// Merge build options with global options.
const options = Object.assign( buildOptions, parseArguments( process.argv.slice( 2 ) ) );

// Run webpack.
webpack( getWebpackConfig( options ), ( err, stats ) => {
	if ( err ) {
		console.log( err );
		process.exit( 1 );
	}

	console.log( stats.toString() );
} );
