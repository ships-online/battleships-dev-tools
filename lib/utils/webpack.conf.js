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
					exclude: file => (
						/(node_modules\/((?!ckeditor|battleships)[a-z-]+))/.test( file ) &&
						!/\.vue\.js/.test( file )
					),
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
				test: /\.(js|vue)$/,
				include: getSourceFilesFromGlob( options.files ),
				enforce: 'post',
				loader: 'istanbul-instrumenter-loader',
				query: {
					esModules: true
				}
			}
		);
	}

	return webpackConfig;
};
