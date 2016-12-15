# grunt-multi [![Build Status: Linux](https://travis-ci.org/rerodrigues/grunt-multi.svg?branch=master)](https://travis-ci.org/rerodrigues/grunt-multi) [![Build status: Windows](https://ci.appveyor.com/api/projects/status/at7pq24cggun1k6t/branch/master?svg=true)](https://ci.appveyor.com/project/rerodrigues/grunt-multi)

> Run Grunt task with multi-configuration.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-multi --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-multi');
```

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

Quite simple, and when you run `grunt build`, you will get all the JS files under `src/a` copied to `build/a`.

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
    // A more smart way might be to read from an external file.
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
    // For the consideration of flexibility，you can use a function, but note that the return value must be either an Array or String.
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
    // Also you can use a function to directly modify the config. This is useful if you want to get more flexibility to modify the configuration.
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

After configuration, you just run `grunt multi:func`( or any defined sub task ) to execute the multi version of copy.

### Options

Available options:

- `vars`: variables can be used within the next option `config`, in fact `var` is a list, you can get the list by `file pattern`, `array`, `function`(return a list).
- `config`: the config item you want to change, you can use `vars` as template variables.
- `tasks`: the tasks you want to run.
- `continued`: if set to `true`, you indicate that the task will not stop. ( example: watch ).
- `logBegin`: Function, return log content you want to put in front of a thread.
- `logEnd`: Function, return log content you want to put after a thread finish.
- `maxSpawn`: The max number of spawns that can run at the same time.

Options can be specified globally for all `multi` targets and individually within each `multi:target`.

##### Task options (all targets)

```js
//Both targets (list and constant_func) will inherit task options
//and wiil have the vars.page_list = [ 'a', 'b', 'c' ]
multi: {
    options : {
        vars: {
            page_list: [ 'a', 'b', 'c' ]
        }
    },
    list: {
        options: {
            config: {
                targetPage: '<%= page_list %>'
            },
            tasks: [ 'copy' ]
        }
    },
    constant_func: {
        options: {
            config: {
                targetPage: function( vars, rawConfig ){ return vars.page_list; },
            },
            tasks: [ 'copy' ]
        }
    }
}
```

##### Target specific options

```js
//Both targets (list and constant_func) will inherit task options
//but only list target will have vars.page_list = [ 'a', 'b', 'c' ]
//In the constant_func target the global vars.page_list will be
//overwritten by the target specific option vars.page_list = [ 'x', 'y', 'z' ]
multi: {
    options : {
        vars: {
            page_list: [ 'a', 'b', 'c' ]
        }
    },
    list: {
        options: {
            config: {
                targetPage: '<%= page_list %>'
            },
            tasks: [ 'copy' ]
        }
    },
    constant_func: {
        options: {
            vars: {
                page_list: [ 'x', 'y', 'z' ]
            },
            config: {
                targetPage: function( vars, rawConfig ){ return vars.page_list; },
            },
            tasks: [ 'copy' ]
        }
    }
}
```

### Specify `vars` with command

```bash
$ grunt multi:func --page_list=a,b,c --outTarget=mod2.js
```

### Specify `tasks` with command (comma separated)
```bash
$ grunt multi:func --option-tasks=compile

$ grunt multi:func --option-tasks=jshint,build
```

### Specify `continued` with command (defaults to `true`)
```bash
$ grunt multi:func --option-continued

$ grunt multi:func --option-continued=true|false
```

### Specify `maxSpawn` with command
```bash
$ grunt multi:func --option-max-spawn=10
```

Note these options will override the configuration in `Gruntfile.js`.

### How to decide if its a multi-single thread.

In some cases, maybe you want to tell if the current thread is a child spawned by `grunt-multi`. Just use the `multi-single` option to distinguish:

```
if( grunt.option( 'multi-single' ) ){
    console.log( 'Child' );
}
```

### Contributing

Your contribution is always welcome. You can contribute with suggestions, comments, reporting issues and of course with code!

If you are planning to submit code please check these simple [development rules](DEVELOPMENT_GUIDE.md) created to maintain the existing coding style and ensure that everything still working as expected.

Enjoy!
