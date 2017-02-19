'use strict';

const del = require( 'del' );

const utils = {
	/**
	 * Parses shell arguments.
	 *
	 * @param args
	 */
	parseArgs( args ) {
		return require( 'minimist' )( args, {
			boolean: [ 'coverage', 'watch', 'sourcemap' ],
			string: [ 'files', 'format' ],
			alias: {
				coverage: 'c',
				sourcemap: 's',
				watch: 'w',
				files: 'f'
			}
		} );
	},

	/**
	 * Executes a shell command.
	 *
	 * @param {String} command The command to be executed.
	 * @param {Boolean} [logOutput] When set to `false` command's output will not be logged. When set to `true`,
	 * stdout and stderr will be logged. Defaults to `true`.
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
	del: del
};

module.exports = utils;
