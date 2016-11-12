'use strict';

module.exports = ( config, options = {} ) => {
	const webpackConfig = {
		resolve: {
			root: [ config.ROOT_PATH ]
		},

		module: {
			preLoaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loader: 'babel',
					query: {
						cacheDirectory: true,
						plugins: [
							'transform-es2015-modules-commonjs'
						]
					}
				}
			]
		}
	};

	if ( options.sourcemap ) {
		webpackConfig.devtool = 'eval';
	}

	if ( options.coverage ) {
		webpackConfig.module.preLoaders[ 0 ].query.plugins.push(
			[ 'istanbul', { 'exclude': [
				'tests/**/*.js',
				'engine/**/*.js',
				'lib/**/*.js'
			] } ]
		);
	}

	return webpackConfig;
};
