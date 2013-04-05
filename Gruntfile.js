
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
        mangle: false,
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
        globals: {
          jQuery: true
        }
      },
      all: ['tinycolor.js']
    }
  });


  grunt.registerTask('docco', 'Annotate the source.', function(options) {
    grunt.utils.spawn({
      cmd: "docco",
      args: ['-o', 'docs', 'tinycolor.js']
    });
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['jshint', 'uglify', 'docco']);

};
