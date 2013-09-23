module.exports = function (grunt) {

    /**
     * 对每个具体任务进行配置
     */
    grunt.initConfig({

        targetPage: 'a',
        outTarget: 'mod1.js',

        copy: {
            subDir: {
                files: [
                    // widget中的字体
                    {
                        expand: true,
                        cwd: 'src',
                        src: [ '<%= targetPage %>/*.js' ],
                        dest: 'build'
                    }
                ]
            },
            out: {
                files: [
                    // widget中的字体
                    {
                        expand: true,
                        cwd: 'src',
                        src: '<%= outTarget %>',
                        dest: 'build'
                    }
                ]
            }
        },

        multi: {
            pattern: {
                options: {
                    vars: {
                        page_list: { patterns: '*', options: { cwd: 'src', filter: 'isDirectory' } }
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    }
                }
            },
            list: {
                options: {
                    vars: {
                        page_list: [ 'a', 'b', 'c' ]
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    }
                }
            },
            external: {
                options: {
                    vars: {
                        page_list: grunt.file.readJSON('build.json').target
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    }
                }
            },
            constant: {
                options: {
                    vars: {
                        page_list: [ 'a', 'b', 'c' ],
                        out_target: 'mod2.js'
                    },
                    config: {
                        targetPage: '<%= page_list %>',
                        outTarget: '<%= out_target %>'
                    }
                }
            },
            func: {
                options: {
                    vars: {
                        page_list: function(){
                            return [ 'a', 'b', 'c' ];
                        }
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    }
                }
            },
            command: {
                options: {
                    config: {
                        targetPage: '<%= page_list %>',
                        outTarget: '<%= out_target %>'
                    }
                }
            }
        }
    });

    grunt.task.loadTasks( '../../tasks' );
    grunt.task.loadNpmTasks('grunt-contrib-copy' );
    grunt.registerTask('list', [ 'multi:list', 'copy' ]);
    grunt.registerTask('pattern', [ 'multi:pattern', 'copy' ]);
    grunt.registerTask('external', [ 'multi:external', 'copy' ]);
    grunt.registerTask('constant', [ 'multi:constant', 'copy' ]);
    grunt.registerTask('func', [ 'multi:func', 'copy' ]);
    grunt.registerTask('cmd', [ 'multi:command', 'copy' ]);
};