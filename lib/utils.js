'use strict';

module.exports = () => {
	return {
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
		}
	};
};
