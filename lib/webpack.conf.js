'use strict';

const path = require( 'path' );

module.exports = ( config, options = {} ) => {
	const webpackConfig = {
		resolve: {
			modules: [ config.ROOT_PATH, 'node_modules' ]
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
			rules: [
				{
					test: /\.js$/,
					exclude: [ /(node_modules\/((?!ckeditor|battleships)[a-z-]+))/ ],
					loader: 'babel-loader',
					query: {
						cacheDirectory: true,
						plugins: [ require( 'babel-plugin-transform-es2015-modules-commonjs' ) ]
					}
				},
				{
					test: /\.scss$/,
					use: [
						'style-loader',
						'css-loader',
						'sass-loader'
					]
				},
			]
		}
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
		webpackConfig.module.rules[ 0 ].query.plugins.push( [
			'istanbul', {
				'exclude': [ 'node_modules/**', 'tests/**', 'lib/**' ]
			}
		] );
	}

	return webpackConfig;
};
