'use strict';

const utils = {
	/**
	 * Parses shell arguments.
	 *
	 * @param args
	 */
	parseArgs( args ) {
		const options = require( 'minimist' )( args, {
			boolean: [ 'coverage', 'watch', 'sourcemap' ],
			string: [ 'files', 'format', 'socket-url' ],
			alias: {
				coverage: 'c',
				sourcemap: 's',
				watch: 'w',
				files: 'f'
			}
		} );

		return {
			coverage: options.coverage,
			watch: options.watch,
			sourcemap: options.sourcemap,
			files: options.files ? options.files.split( ',' ) : [],
			environment: {
				SOCKET_URL: options[ 'socket-url' ] || 'localhost:8080'
			}
		};
	},

	/**
	 * Executes a shell command.
	 *
	 * @param {String} command The command to be executed.
	 * @returns {String} The command output.
	 */
	shExec( command ) {
		const sh = require( 'shelljs' );
		const ret = sh.exec( command );

		if ( ret.code ) {
			throw new Error( `Error while executing ${ command }: ${ ret.stderr }` );
		}

		return ret.stdout;
	},

	/**
	 * Removes files for specified glob.
	 */
	del() {
		return require( 'del' )( ...arguments );
	}
};

module.exports = utils;
