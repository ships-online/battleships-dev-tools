'use strict';

const { getSourceFilesFromGlob } = require( './gettestfiles.js' );

module.exports = function getWebpackConfig( options ) {
	const webpackConfig = {
		resolve: {
			modules: [ 'packages', process.cwd(), 'node_modules' ]
		},

		watch: options.watch,

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
				}
			]
		},
	};

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

	return webpackConfig;
};