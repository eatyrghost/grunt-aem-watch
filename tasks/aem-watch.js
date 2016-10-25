/*global require:true, module:true */
// Requires
var exec = require('child_process').exec,
	path = require('path'),
	request = require('request'),
	fs = require('fs');

// Declare the module
module.exports = function (grunt) {
	'use strict';

	grunt.registerMultiTask('aem-watch', 'Upload watched files to an active AEM instance', function () {
		var cfg = {},
			defaultServers = {
				'author': {
					'host': 'localhost',
					'password': 'admin',
					'port': '4502',
					'target': '/',
					'username': 'admin'
				},
				'publish': {
					'host': 'localhost',
					'password': 'admin',
					'port': '4503',
					'target': '/',
					'username': 'admin'
				}
			},
			options = this.options(),
			requestCallback = function (error, status, response) {
				var consoleMessage = '',
					responseObj = null,
					statusCode = '201';

				// Not throwing errors
				if (error) {
					consoleMessage = 'The upload failed.';
				} else {
					try {
						responseObj = JSON.parse(response);
						statusCode = validString(responseObj['status.code'], '201');
						consoleMessage = statusCode + ': file uploaded successfully to ' + requestCfg.url; 
					} catch (e) {
						consoleMessage = 'There was an error reading the response.';
					}
				}

				// Output our message
				grunt.log.writeln(consoleMessage);
			},
			requestCfg = {
				'headers': {
					'Accept': 'application/json'
				},
				'method': 'POST'
			},
			requestObj = null,
			requestObjForm = null,
			server = '',
			targetPath = '',
			validString = function (str, defaultValue) {
				if (typeof str === 'string') {
					return str;
				} else if (typeof str !== 'undefined' && typeof str !== 'function' && typeof str.toString === 'function') {
					return str.toString();
				} else {
					return (typeof defaultValue === 'string' ? defaultValue : '');
				}
			};

		// Start with a basic server configuration
		server = validString(options.server);
		if (server !== '') {
			cfg = (typeof defaultServers[server] === 'object' && defaultServers[server] !== null ? defaultServers[server] : {});
		} else {
			cfg = defaultServers['author'];
		}

		// Read the rest of the options as configured by the developer
		cfg.host = validString(options.host, cfg.host);
		cfg.password = validString(options.password, cfg.password);
		cfg.port = validString(options.port, cfg.port);
		cfg.target = validString(options.target, cfg.target);
		cfg.username = validString(options.username, cfg.username);

		this.files.forEach(function (file) {
			file.src.forEach(function (sourcePath) {
				var lastUpdate = fs.statSync(sourcePath).mtime.getTime(),
					withinRange = lastUpdate > Date.now() - 10000;

				grunt.log.writeln(withinRange);
				// Generate the target URL
				targetPath = sourcePath.replace('jcr_root/', '');
				requestCfg.url = 'http://'
					+ cfg.username
					+ ':'
					+ cfg.password
					+ '@'
					+ cfg.host
					+ (cfg.port !== '' ? ':' : '')
					+ cfg.port
					+ cfg.target
					+ path.dirname(targetPath)
					+ '.json';

				// Make the request
				requestObj = request(requestCfg, requestCallback).auth(cfg.username, cfg.password);
				requestObjForm = requestObj.form();
				requestObjForm.append('*', fs.createReadStream(sourcePath));
				requestObjForm.append('@TypeHint', 'nt:file');
			});
		});
	});
};