
module.exports = function(grunt) {

  grunt.initConfig({
    lint: {
      all: ['tinycolor.js']
    },

    jshint: {
      options: {
        browser: true,
        sub: true
      },
      globals: {
        jQuery: true
      }
    }
  });

  grunt.registerTask('default', 'lint');

};
