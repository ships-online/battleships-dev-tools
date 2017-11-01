'use strict';

const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = ( config, options ) => {
	const webpackConfig = {
		resolve: {
			modules: [ 'packages', config.ROOT_PATH, 'node_modules' ]
		},

		entry: options.inputPath,

		output: {
			path: path.dirname( options.outputPath || '' ),
			filename: path.basename( options.outputPath || '' ),
			publicPath: path.relative( config.ROOT_PATH, path.dirname( options.outputPath || '' ) ) + path.sep,
			library: path.basename( options.outputPath || '', '.js' ),
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
						'style-loader',
						'css-loader',
						'sass-loader'
					]
				},
				{
					test: /\.svg$/,
					use: [
						'file-loader'
					]
				}
			]
		},

		plugins: [
			// https://webpack.js.org/plugins/define-plugin/
			new webpack.DefinePlugin( options.environment ),
		]
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
		const excludes = [];

		// Temporary fix to not include packages in CC.
		if ( !options.files.some( file => file.includes( 'packages' ) ) ) {
			excludes.push( 'packages/**' );
		}

		webpackConfig.module.rules[ 0 ].query.plugins.push( [
			'istanbul', {
				'exclude': [ 'node_modules/**', '**/tests/**', 'lib/**', ...excludes ]
			}
		] );
	}

	return webpackConfig;
};
