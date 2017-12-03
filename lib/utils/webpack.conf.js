'use strict';

const path = require( 'path' );
const webpack = require( 'webpack' );
const getTestFilesFromGlob = require( './gettestfilesfromglob.js' );

module.exports = function getWebpackConfig( options ) {
	const webpackConfig = {
		resolveLoader: {
			modules: [ 'packages', process.cwd(), 'node_modules' ]
		},

		entry: path.join( process.cwd(), options.input || '' ),

		output: {
			path: path.join( process.cwd(), path.dirname( options.output || '' ) ),
			filename: path.basename( options.output || '' ),
			publicPath: path.relative( process.cwd(), path.dirname( options.output || '' ) ) + path.sep,
			library: path.basename( options.output || '', '.js' ),
			libraryTarget: 'umd',
			umdNamedDefine: true
		},

		watch: options.watch,

		plugins: [
			new webpack.DefinePlugin( options.environment )
		],

		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules\/((?!ckeditor|battleships)[a-z-]+))/,
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
	};

	if ( options.test ) {
		webpackConfig.output = webpackConfig.entry = undefined;
	}

	if ( options.sourceMap ) {
		webpackConfig.devtool = 'inline-source-map';
	}

	if ( options.coverage ) {
		webpackConfig.module.rules.push(
			{
				test: /\.js$/,
				include: getSourceFilesFromGlob( options.files ),
				loader: 'istanbul-instrumenter-loader',
				query: {
					esModules: true
				}
			}
		);
	}

	function getSourceFilesFromGlob( globs ) {
		return getTestFilesFromGlob( globs ).map( file => {
			if ( file.includes( '/_utils-tests/' ) ) {
				file = file.replace( '/_utils-tests/', '/_utils/' );
			} else {
				file = file.replace( '/tests/', '/src/' );
			}

			return file;
		} );
	}

	return webpackConfig;
};
