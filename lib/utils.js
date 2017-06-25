'use strict';

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
	 * Removes files for specified glob.
	 */
	del() {
		return require( 'del' )( ...arguments );
	}
};

module.exports = utils;
