'use strict';

module.exports = ( config, options = {} ) => {
	options.test = true;

	const webpackConfig = require( './webpack.conf.js' )( config, options );

	const karmaConfig = {
		// Base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: config.ROOT_PATH,

		// List of files/patterns to load in the browser.
		files: [
			'tests/**/*.js'
		],

		// Frameworks to use
		frameworks: [ 'mocha', 'chai', 'sinon' ],

		// A map of preprocessors to use.
		preprocessors: {
			'tests/**/*.js': [ 'webpack' ]
		},

		// Webpack configuration.
		webpack: webpackConfig,

		webpackMiddleware: {
			noInfo: true,
			stats: {
				chunks: false
			}
		},

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: [ 'mocha' ],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: 'INFO',

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - PhantomJS2
		// - IE (only Windows)
		browsers: [ 'Chrome' ],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// When Karma is watching the files for changes, it tries to batch multiple changes into a single run so
		// that the test runner doesn't try to start and restart running tests more than it should.
		// The configuration setting tells Karma how long to wait (in milliseconds) after any changes
		// have occurred before starting the test process again.
		autoWatchBatchDelay: 1000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true,

		// When Karma is watching the files for changes, it will delay a new run until the current run is finished.
		// Enabling this setting will cancel the current run and start a new run immediately when a change is detected.
		restartOnFileChange: true
	};

	if ( options.files ) {
		karmaConfig.files = [ options.files ];
	}

	if ( options.coverage ) {
		karmaConfig.reporters.push( 'coverage' );

		// Istanbul coverage reporter configuration.
		karmaConfig.coverageReporter = {
			dir: 'coverage/',
				reporters: [
				{ type: 'html' },
				{ type: 'text-summary' }
			]
		};
	}

	if ( options.sourcemap ) {
		for ( let preprocessor in karmaConfig.preprocessors ) {
			karmaConfig.preprocessors[ preprocessor ].push( 'sourcemap' );
		}
	}

	if ( options.watch ) {
		karmaConfig.singleRun = false;
	}

	return karmaConfig;
};
