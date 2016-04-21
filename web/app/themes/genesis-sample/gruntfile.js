module.exports = function(grunt) {

	// Load all grunt tasks in package.json matching the `grunt-*` pattern.
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Compile Sass into CSS using node-sass.
		 *
		 * @link https://github.com/sindresorhus/grunt-sass
		 * @link https://github.com/sass/node-sass#options
		 */
		sass: {
			options: {
				outputStyle: 'expanded', // Determines the output format of the final CSS style.
				sourceComments: false, // Enables additional debugging information in the output file as CSS comments.
				sourceMap: true, // Enables the outputting of a source map.
				includePaths: require('node-bourbon').includePaths, // Include Bourbon
			},
			dist: {
				files: {
					'style.css': 'sass/style.scss'
				}
			}
		},

		/**
		 * Apply several post-processors to CSS using PostCSS.
		 *
		 * @link https://github.com/nDmitry/grunt-postcss
		 */
		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer')({ browsers: 'last 2 versions' })
			]},
			dist: {
				src: ['style.css', '!*.min.js']
			}
		},

		/**
		 * A modular minifier, built on top of the PostCSS ecosystem.
		 *
		 * @link https://github.com/ben-eb/cssnano
		 */
		cssnano: {
			options: {
				autoprefixer: false,
				safe: true,
			},
			dist: {
				files: {
					'style.min.css': 'style.css'
				}
			}
		},

		/**
		 * Concatenate files.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-concat
		 */
		concat: {
			dist: {
				src: ['js/concat/*.js'],
				dest: 'js/script.js',
			}
		},

		/**
		 * Minify files with UglifyJS.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-uglify
		 */
		uglify: {
			build: {
				options: {
					sourceMap: true,
					mangle: false
				},
				files: [{
					expand: true,
					cwd: 'js/',
					src: ['**/*.js', '!**/*.min.js', '!concat/*.js'],
					dest: 'js/',
					ext: '.min.js'
				}]
			}
		},

		/**
		 * Optimize PNG, JPG, and GIF images.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-imagemin
		 */
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'images/'
				}]
			}
		},

		/**
		 * Run tasks whenever watched files change.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-watch
		 */
		watch: {

			scripts: {
				files: ['js/**/*.js'],
				tasks: ['javascript'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			css: {
				files: ['sass/**/*.scss'],
				tasks: ['styles'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			images: {
				files: ['images/*'],
				tasks: ['imageminnewer'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
		},

		/**
		 * Run shell commands.
		 *
		 * @link https://github.com/sindresorhus/grunt-shell
		 */
		shell: {
			grunt: {
				command: '',
			}
		},

		/**
		 * Automatic Notifications when Grunt tasks fail.
		 *
		 * @link https://github.com/dylang/grunt-notify
		 */
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5,
				title: "genesis",
				success: false,
				duration: 2,
			}
		},
	});

	// Register Grunt tasks.
	grunt.registerTask('styles', ['sass', 'postcss', 'cssnano']);
	grunt.registerTask('javascript', ['concat', 'uglify']);
	grunt.registerTask('imageminnewer', ['newer:imagemin']);
	grunt.registerTask('default', ['styles', 'javascript', 'imageminnewer']);

	// grunt-notify shows native notifications on errors.
	grunt.loadNpmTasks('grunt-notify');
	grunt.task.run('notify_hooks');
};