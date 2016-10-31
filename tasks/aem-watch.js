/*global require:true, module:true */
// Requires
var async = require('async'),
	exec = require('child_process').exec,
	moment = require('moment'),
	needle = require('needle'),
	path = require('path'),
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
			done = this.async(),
			fileArray = [],
			options = this.options(),
			requestData = {},
			requestUrl = '',
			server = '',
			targetPath = '',
			uploadFile = function (file) {
				var fileName = path.basename(file).toString();

				grunt.log.writeln('Uploading file', file);
				// Generate the target URL
				targetPath = file.replace('jcr_root/', '');
				requestUrl = 'http://'
					+ cfg.username
					+ ':'
					+ cfg.password
					+ '@'
					+ cfg.host
					+ (cfg.port !== '' ? ':' : '')
					+ cfg.port
					+ cfg.target
					+ path.dirname(targetPath);

				// Generate the form data
				requestData = {
					'*': {
						'file': file,
						'content_type': 'text'
					},
					'*@TypeHint': 'nt:file'
				};

				// Make the request
				needle.post(requestUrl, requestData, {
					'json': true,
					'multipart': true
				}).on('readable', function () {
				}).on('end', function () {
					grunt.log.writeln('Uploaded file', file);
				});
			},
			uploadedFile = function (error) {
				if (error) {
					grunt.fail.fatal(error);
				}
				done(error);
			},
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

		// Find updated files only
		this.files.forEach(function (file) {
			file.src.forEach(function (sourcePath) {
				var lastUpdate = fs.statSync(sourcePath).mtime.getTime(),
					updateMoment = moment(lastUpdate),
					currentTime = Date.now(),
					currentMoment = moment(currentTime).seconds(-15),
					withinRange = (updateMoment.isAfter(currentMoment));

				// Only push the file if we are within our time range
				if (withinRange === true) {
					fileArray.push(sourcePath);
				}
			});
		});

		// Upload the files
		if (fileArray.length > 0) {
			async.each(fileArray, uploadFile, uploadedFile);
		} else {
			done();
		}
	});
};