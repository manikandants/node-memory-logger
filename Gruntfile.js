module.exports = function(grunt) {
	'use strict';
	var src = {
		js : ['Gruntfile.js', 'index.js']
	};
	grunt.initConfig({
		jshint : {
			all: src.js
		},
		jscs : {
			all: src.js
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');

	grunt.registerTask('test', ['jshint' , 'jscs']);
};
