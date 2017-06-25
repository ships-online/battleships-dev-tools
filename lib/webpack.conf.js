'use strict';

const path = require( 'path' );

module.exports = ( config, options = {} ) => {
	const webpackConfig = {
		resolve: {
			modules: [ 'packages', config.ROOT_PATH, 'node_modules' ]
		},

		entry: options.inputPath,

		output: {
			path: path.dirname( options.outputPath || '' ),
			filename: path.basename( options.outputPath || '' ),
			publicPath: path.relative( config.ROOT_PATH, path.dirname( options.outputPath || '' ) ) + path.sep,
			library: path.basename( options.outputPath, '.js' ),
			libraryTarget: 'umd',
			umdNamedDefine: true
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
						require( 'style-loader' ),
						require( 'css-loader' ),
						require( 'sass-loader' )
					]
				},
				{
					test: /\.svg$/,
					use: [
						require( 'file-loader' )
					]
				}
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
