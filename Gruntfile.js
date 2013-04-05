
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// TinyColor v<%= pkg.version %>\n' +
        '// https://github.com/bgrins/TinyColor\n' +
        '// <%= grunt.template.today("yyyy-mm-dd") %>, Brian Grinstead, MIT License\n'
    },

    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'tinycolor.js'],
        dest: 'dist/tinycolor.js'
      }
    },

    min: {
      dist: {
        src: ['<banner:meta.banner>', 'tinycolor.js', '\n'],
        dest: 'dist/tinycolor-min.js'
      }
    },

    qunit: {
      all: ['test/index.html']
    },


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


  grunt.registerTask('docco', 'Annotate the source.', function(options) {
    grunt.utils.spawn({
      cmd: "docco",
      args: ['-o', 'docs', 'tinycolor.js']
    });
  });


  grunt.registerTask('default', 'lint qunit');
  grunt.registerTask('build', 'lint qunit min docco');

};
