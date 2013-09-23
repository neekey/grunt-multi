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
            }
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
            }
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
            }
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
            }
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
            }
        }
    }
}
```

After configuration you must add the `multi` task in front of your task List, change the code like below:

```js
grunt.registerTask('build', [ 'multi:list', 'copy' ]);
```

But when you run `grunt build` again, nothing magic happen. That's the point, for the risk of ruining your old task, the `grunt-multi` would not work until you specify a `--multi` flag, so just try it, nothing will hurt you.

One more thing, you can also add an additional flat `--debug` to console out the particular configuration for a single thread.
 
### Specify `vars` with command

```bash
$ grunt build --multi --multi-vars page_list=a,b,c:outTarget=mod2.js
```
Note that this will override the configuration in `gruntfile.js`.

Enjoy!