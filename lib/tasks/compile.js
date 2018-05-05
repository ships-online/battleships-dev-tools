'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const gulpPrint = require( 'gulp-print' );
const gulpReplace = require( 'gulp-replace' );
const gulpBabel = require( 'gulp-babel' );

module.exports = function compile( options ) {
	const { src, dest, replace } = options;

	if ( !src ) {
		throw new Error( 'Missing source directory.' );
	}

	if ( !dest ) {
		throw new Error( 'Missing destination directory.' );
	}

	const stream = gulp.src( path.join( src, '**', '*.js' ), { base: src } );

	for ( const key of Object.keys( replace ) ) {
		stream.pipe( gulpReplace( ` from '${ key }`, ` from '${ replace[ key ] }` ) );
	}

	return stream.pipe( gulpBabel( { plugins: [ 'babel-plugin-transform-es2015-modules-commonjs' ] } ) )
		.pipe( gulpPrint() )
		.pipe( gulp.dest( dest ) )
		.on( 'error', err => console.log( err ) );
};
