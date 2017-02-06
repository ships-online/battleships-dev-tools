'use strict';

const path = require( 'path' );

module.exports = ( config, options = {} ) => {
	const webpackConfig = {
		resolve: {
			root: [ config.ROOT_PATH ]
		},

		entry: options.inputPath,

		output: {
			path: path.dirname( options.outputPath || '' ),
			filename: path.basename( options.outputPath || '' ),
			libraryTarget: 'umd',
			umdNamedDefine: true,
			library: 'Battleships'
		},

		module: {
			preLoaders: [
				{
					test: /\.js$/,
					loader: 'babel',
					query: {
						cacheDirectory: true,
						plugins: [ 'transform-es2015-modules-commonjs' ]
					}
				}
			]
		},

		watch: false
	};

	if ( options.watch ) {
		webpackConfig.watch = true;
	}

	if ( options.test ) {
		webpackConfig.output = webpackConfig.entry = undefined;
	}

	if ( options.sourcemap ) {
		webpackConfig.devtool = 'inline-source-map';
	}

	if ( options.coverage ) {
		webpackConfig.module.preLoaders[ 0 ].query.plugins.push(
			[ 'istanbul', { 'exclude': [
				'node_modules/**/*.js',
				'tests/**/*.js',
				'lib/**/*.js',
			] } ]
		);
	}

	return webpackConfig;
};