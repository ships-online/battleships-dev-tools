'use strict';

const minimist = require( 'minimist' );

module.exports = function parseArguments( args ) {
	const options = minimist( args, {
		string: [
			'socket-url'
		],

		boolean: [
			'watch',
			'source-map'
		],

		alias: {
			w: 'watch',
			s: 'source-map'
		},

		default: {
			watch: false,
			coverage: false,
			'source-map': false,
			'socket-url': 'localhost:8080'
		}
	} );

	options.sourceMap = options[ 'source-map' ];

	options.environment = {
		SOCKET_URL: JSON.stringify( options[ 'socket-url' ] )
	};

	return options;
};
