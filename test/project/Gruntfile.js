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
                    },
                    tasks: [ 'copy' ]
                }
            },
            list: {
                options: {
                    vars: {
                        page_list: [ 'a', 'b', 'c' ]
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    },
                    tasks: [ 'copy' ]
                }
            },
            external: {
                options: {
                    vars: {
                        page_list: grunt.file.readJSON('build.json').target
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    },
                    tasks: [ 'copy' ]
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
                    },
                    tasks: [ 'copy' ]
                }
            },
            constant_func: {
                options: {
                    vars: {
                        page_list: [ 'a', 'b', 'c' ],
                        out_target: 'mod2.js'
                    },
                    config: {
                        targetPage: function( vars, rawConfig ){ return vars.page_list; },
                        outTarget: function( vars, rawConfig ){ return vars.out_target; }
                    },
                    tasks: [ 'copy' ]
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
                    },
                    tasks: [ 'copy' ]
                }
            },
            command: {
                options: {
                    config: {
                        targetPage: '<%= page_list %>',
                        outTarget: '<%= out_target %>'
                    },
                    tasks: [ 'copy' ]
                }
            },
            log: {
                options: {
                    logBegin: function( vars ){
                        return 'Begin building page: ' + vars.page_list + ' !';
                    },
                    logEnd: function( vars ){
                        return 'Building page: ' + vars.page_list + ' success!';
                    },
                    vars: {
                        page_list: [ 'a', 'b', 'c' ]
                    },
                    config: {
                        targetPage: '<%= page_list %>'
                    },
                    tasks: [ 'copy' ]
                }
            }
        }
    });

    grunt.task.loadTasks( '../../tasks' );
    grunt.task.loadNpmTasks('grunt-contrib-copy' );
};