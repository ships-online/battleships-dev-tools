#!/usr/bin/env node

'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const gulpPrint = require( 'gulp-print' );
const gulpReplace = require( 'gulp-replace' );
const gulpBabel = require( 'gulp-babel' );
const minimist = require( 'minimist' );
const parseArguments = require( '../lib/utils/parsearguments.js' );

// Parse compile options.
const compileOptions = minimist( process.argv.slice( 2 ), {
	string: [
		'src',
		'dest',
		'format',
		'relative'
	]
} );

if ( !compileOptions.src ) {
	throw new Error( 'Missing source directory.' );
}

if ( !compileOptions.dest ) {
	throw new Error( 'Missing destination directory.' );
}

if ( compileOptions.format !== 'cjs' ) {
	throw new Error( 'Unsupported format.' );
}

// Merge compile options with global options.
const options = Object.assign( compileOptions, parseArguments( process.argv.slice( 2 ) ) );

const src = path.join( process.cwd(), compileOptions.src );
const dest = path.join( process.cwd(), compileOptions.dest );
const relative = options.relative || '';
const ckePrefix = '@ckeditor/ckeditor5-';
const battleshipsPrefix = 'battleships-';

gulp.src( path.join( src, '**', '*.js' ), { base: src } )
	.pipe( gulpReplace( ` from '${ battleshipsPrefix }`, ` from '${ relative }${ battleshipsPrefix }` ) )
	.pipe( gulpReplace( ` from '${ ckePrefix }`, ` from '${ relative }${ ckePrefix }` ) )
	.pipe( gulpBabel( { plugins: [ 'babel-plugin-transform-es2015-modules-commonjs' ] } ) )
	.pipe( gulpPrint() )
	.pipe( gulp.dest( dest ) )
	.on( 'error', err => {
		console.log( err );
	} );
