'use strict';

const path = require( 'path' );
const merge = require( 'webpack-merge' );
const { getTestFilesFromGlob, getSourceFilesFromGlob } = require( './gettestfiles.js' );

module.exports = function getKarmaConfig( options ) {
	if ( !Array.isArray( options.files ) || options.files.length === 0 ) {
		throw new Error( 'Karma requires files to tests. `options.files` has to be non-empty array.' );
	}

	let webpackConfig = require( './webpack.conf.js' )( Object.assign( options, { test: true } ) );

	if ( options.config ) {
		const additionalConfig = require( path.join( process.cwd(), options.config ) )( options );

		webpackConfig = merge( webpackConfig, additionalConfig );
	}

	// Get files list to tests (tests and sources).
	const files = getTestFilesFromGlob( options.files ).concat( getSourceFilesFromGlob( options.files ) );

	// Set preprocessors for files.
	const preprocessorMap = {};

	for ( const file of files ) {
		preprocessorMap[ file ] = [ 'webpack' ];

		if ( options.sourceMap ) {
			preprocessorMap[ file ].push( 'sourcemap' );
		}
	}

	const karmaConfig = {
		// Base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: process.cwd(),

		// Frameworks to use
		frameworks: [ 'mocha', 'chai', 'sinon' ],

		// List of files/patterns to load in the browser.
		files,

		// Exclude some files.
		exclude: [
			path.join( 'tests', '**', '_utils', '**', '*.js' )
		],

		// Preprocess matching files before serving them to the browser.
		// Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: preprocessorMap,

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
		browsers: [ process.env.TRAVIS ? 'CHROME_TRAVIS_CI' : 'CHROME_LOCAL' ],

		customLaunchers: {
			CHROME_TRAVIS_CI: {
				base: 'Chrome',
				flags: [ '--no-sandbox', '--disable-background-timer-throttling' ]
			},
			CHROME_LOCAL: {
				base: 'Chrome',
				flags: [ '--disable-background-timer-throttling' ]
			}
		},

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
		restartOnFileChange: true,

		// Shows differences in object comparison.
		mochaReporter: {
			showDiff: true
		}
	};

	if ( options.watch ) {
		// Enable/Disable watching file and executing tests whenever any file changes.
		karmaConfig.autoWatch = true;
		karmaConfig.singleRun = false;
	}

	if ( options.coverage ) {
		const coverageDir = path.join( process.cwd(), 'coverage' );

		karmaConfig.reporters.push( 'coverage' );

		karmaConfig.coverageReporter = {
			reporters: [
				{
					type: 'text-summary'
				},
				{
					dir: coverageDir,
					type: 'html'
				},
				// Generates "./coverage/lcov.info". Used by CodeClimate.
				{
					type: 'lcovonly',
					subdir: '.',
					dir: coverageDir
				}
			]
		};
	}

	return karmaConfig;
};
