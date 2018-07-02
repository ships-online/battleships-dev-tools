'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const gulpPrint = require( 'gulp-print' );
const gulpReplace = require( 'gulp-replace' );
const gulpBabel = require( 'gulp-babel' );

module.exports = function compile( options ) {
	const { src, dest, relative } = options;

	if ( !src ) {
		throw new Error( 'Missing source directory.' );
	}

	if ( !dest ) {
		throw new Error( 'Missing destination directory.' );
	}

	let stream = gulp.src( path.join( src, '**', '*.js' ), { base: src } );

	for ( const prefix of relative ) {
		stream = stream.pipe( gulpReplace( ` from '${ prefix }`, function() {
			const currentPrefix = relative.find( prefix => this.file.path.includes( prefix ) );
			let deeps = '';

			const parts = this.file.path.split( currentPrefix );

			if ( parts[ 1 ] ) {
				const deep = parts[ 1 ].split( '/' ).length - 1;

				for ( let i = deep; i > 0; i-- ) {
					deeps += '../';
				}
			}

			return ` from '${ deeps }${ prefix }`;
		} ) );
	}

	return stream.pipe( gulpBabel( { plugins: [ 'babel-plugin-transform-es2015-modules-commonjs' ] } ) )
		.pipe( gulpPrint() )
		.pipe( gulp.dest( dest ) )
		.on( 'error', err => console.log( err ) );
};
