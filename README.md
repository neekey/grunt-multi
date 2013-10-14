# grunt-multi

Run Grunt task with multi-configuration.

## How to use

Say that we defined a very simple grunt task:

```js
targetPage: 'a',
outTarget: 'mod1.js',

copy: {
   subDir: {
       files: [
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
           {
               expand: true,
               cwd: 'src',
               src: '<%= outTarget %>',
               dest: 'build'
           }
       ]
   }
}

...

// defined your task here
grunt.registerTask('build', [ 'copy' ]);
```

Quite simple, and when you run `grunt build`, you will get all the JS files under `src/a` copyed to `build/a`.

But what if when your project grows larger, maybe you got like `src/b`, `src/c`.. in your project?

And that's what `Grunt-multi` want to solve, you don't need to modify your `copy` configuration, but just want exactly the same task run multiple times but with different configurations ( here within the example, we just want to change the variable `targetPage` ).

Just see code below, let's configure the `grunt-multi` task:

```js
multi: {
    // Yes, you can use file pattern to match files or paths
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
    // Also you can specify a list.
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
    // A more smart way might be read from an external file.
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
    // However, sometimes you may want to specify a constant variable.
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
    // For the consideration of flexibility，you can use a function, but note that the return value, must be either an Array or String.
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
    // Also you can use function to direct modify the config, this is useful if you want to get more flexible to modify the configuration.
    // params:
    //      1、vars: a single instant of the vars you defined
    //      2、rawConfig: the raw configuration.
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

    // Custom logs
    custom_log: {
        options: {
            logBegin: function( vars ){
                console.log( 'Begin build page: ' + vars.page_list;
            },
            logEnd: function( vars ){
                console.log( 'Page: ' + vars.page_list + ' success';
            },
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
}
```

After configuration you just run `grunt multi:func`( or any defined sub task ) to execute the multi version of copy.
 
### options

Available options:

- `vars`: variables can be used within the next option `config`, in fact `var` is a list, you can get the list by `file pattern`, `array`, `function`(return a list).
- `config`: the config item you want to change, you can use `vars` as template variables.
- `tasks`: the tasks you want to run.
- `continue`: if set to `true`, you indicate that the task will not stop. ( example: watch ).
- `logBegin`: Function, return log content you want to put in front of a thread.
- `logEnd`: Function, return log content you want to put after a thread finish.
- `maxSpawn`: The max number of spawns that can run at the same time.

### Specify `vars` with command

```bash
$ grunt multi:func --page_list a,b,c --outTarget mod2.js
```
Note that this will override the configuration in `gruntfile.js`.

### How to decide if its a multi-single thread.

In some cases maybe you want to tell if the current thread is a child spawned by `grunt-multi`, just use the `multi-single` option to distinguish:

```
if( grunt.option( 'multi-single' ) ){
    console.log( 'Child' );
}
```

Enjoy!