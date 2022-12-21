
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '// TinyColor v<%= pkg.version %>\n' +
        '// https://github.com/bgrins/TinyColor\n' +
        '// <%= grunt.template.today("yyyy-mm-dd") %>, Brian Grinstead, MIT License\n'
    },

    uglify: {
      options: {
        mangle: true,
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          'dist/tinycolor-min.js': ['tinycolor.js']
        }
      }
    },

    qunit: {
      all: ['test/index.html']
    },


    jshint: {
      options: {
        browser: true,
        sub: true,
      },
      all: ['tinycolor.js']
    },

  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('version-bump', ['jshint', 'qunit', 'uglify']);

};
