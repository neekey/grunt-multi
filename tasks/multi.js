/*
 * Grunt-Multi: Run Grunt task with multi-configuration.
 */
var Util = require( '../lib/utils' );

module.exports = function (grunt) {

    grunt.registerTask( 'multi-single', 'The single task for multi', function(){
        grunt.log.ok( 'A single thread begin:' );

        // Get the raw config and try to update.
        var rawConfig = grunt.config.getRaw();
        // Get the special config
        var singleInfo = JSON.parse(process.env._grunt_multi_info);
        var singleCfg = singleInfo.config;
        var singleTasks = singleInfo.tasks;

        // If --debug is provided.
        if( grunt.util._.indexOf( process.argv, '--debug' ) >= 0 ){
            console.log( '\033[1;32m--------- Configuration --------\033[0m\n' );
            grunt.util._.each( singleCfg, function( value, key ){
                console.log( '\033[1;33m' + key + ':', JSON.stringify(value) + '\033[0m' );
            });
            console.log( '\033[1;32m\n--------------------------------\033[0m\n' );
        }

        // Combine with the raw config.
        grunt.util._.each(singleCfg, function( value, key ){
            rawConfig[ key ] = value;
        });

        // Replace the origin config.
        grunt.config.init( rawConfig );

        // Execute tasks
        grunt.task.run( singleTasks );
    });

    grunt.registerMultiTask( 'multi', 'Run Grunt task with multi-configuration.', function () {

        var done = this.async();

        grunt.log.ok( 'Begin Multi tasks.' );

        // Get the raw `multi` config, in case the glob-patterns have been replaced by grunt automatically.
        var options = grunt.config.getRaw( this.name )[ this.target ].options;
        var vars = options.vars || {};
        var ifContinued = options.continued;
        // Stringify the config, to simplify the template process.
        var configFunc = {};
        var configNotFunc = {};
        var configStr = '';
        var tasks = options.tasks || [];
        // All the var lists go here
        var varList = {};
        /**
         * All the data for template config goes here
         * As we the varList would be like:
         *  { a: [ 1, 2 ], b: [ 3, 4 ] }
         * The configData based on that, and get the structure like:
         *  [ { a: 1, b: 3 }, { a: 2, b: 4 } ]
         */
        var configDatas = [];
        /**
         * The final config List, the structure is much like configData, but without template within its value.
         * @type {Array}
         */
        var configs = [];

        /**
         * Separate the option.config
         */
        grunt.util._.each( options.config, function( cfg, key ){

            if( grunt.util._.isFunction( cfg ) ){
                configFunc[ key ] = cfg;
            }
            else {
                configNotFunc[ key ] = cfg;
            }
        });

        configStr = JSON.stringify( configNotFunc );

        /**
         * If multi-vars specified, it will override the configuration.
         * example: --multi-vars a=1,2,3:b:jack,bill,rose
         */
        if( grunt.option( 'multi-vars' ) ){

            var multiVars = grunt.option( 'multi-vars' );
            var cmdVarsChunk = multiVars.split( ':' );
            cmdVarsChunk.forEach(function( v ){
                var name = v.substring( 0, v.indexOf( '=' ) );
                var values = v.substring( v.indexOf( '=' ) + 1 );
                if( name && values ){
                    values = values.split( ',' );
                }

                if( values.length == 1 ){
                    vars[ name ] = values[ 0 ];
                }
                else {
                    vars[ name ] = values;
                }
            });
        }

        grunt.util._.each( vars, function( value, key ){

            // If a constant value.
            if( grunt.util._.isString( value ) ){
                varList[ key ] = [value];
            }
            // If a specify config list.
            else if ( grunt.util._.isArray( value ) ){
                varList[ key ] = value;
            }
            // If a function provided, it must return a list.
            else if( grunt.util._.isFunction( value ) ){
                varList[ key ] = value();
            }
            // If use glob
            else if( grunt.util._.isObject( value ) ){
                varList[ key ] = grunt.file.expand( value.options || {}, value.patterns );
            }
            else {
                varList[ key ] = [];
            }
        });

        grunt.util._.each( varList, function( list, key ){

            list.forEach(function( v, index ){

                if( !configDatas[ index ] ){
                    configDatas[ index ] = {};
                }

                configDatas[ index ][ key ] = v;
            });
        });

        // Fill the list if a value type is constant.
        grunt.util._.each( vars, function( value, key ){
            if( grunt.util._.isString( value ) ){
                configDatas.forEach(function( cfg ){
                    cfg[ key ] = value;
                });
            }
        });

        // Render the configs.
        configDatas.forEach(function( data, index ){
            var config = grunt.template.process( configStr, { data: data } );
            var cfgObj = JSON.parse( config );
            grunt.util._.each( configFunc, function( func, key ){
                cfgObj[ key ] = func( data, grunt.config.getRaw() );
            });
            configs.push( cfgObj );
        });

        var taskLen = configs.length;
        var taskCount = 0;

        if( taskLen > 0 ){
            // Let's roll!
            grunt.util._.each(configs, function( cfg ){

                /**
                 * Remove the `node` and `grunt` from argv，and keep the rest as it is.
                 * use `--multi-single` to indicate the thread is a single task generated my Multi.
                 * use `--multi-cfg` to pass the single configuration to child process
                 * note the configuration is stringify and encoded.
                 */
                var args = [ 'multi-single', '--multi-single' ];
                if( grunt.util._.indexOf( process.argv, '--debug' ) >= 0 ){
                    args.push( '--debug' );
                }

                Util.spawn( grunt, {
                    grunt: true,
                    args: args,
                    opts: {
                        env: grunt.util._.merge( process.env, { _grunt_multi_info: JSON.stringify({ config: cfg, tasks: tasks }) } )
                    },
                    force: ifContinued
                }, function( error, result, code ){
                    if( !ifContinued ){
                        taskCount++;
                        if( error ){
                            console.log( '\n\033[1;31mBuild Error: \033[0m\n', error, result, code  );
                        }
                        else {
                            console.log( result.stdout.replace( '\n\u001b[32mDone, without errors.\u001b[39m', '' ) );
                        }

                        if( taskCount == taskLen ){
                            done();
                        }
                    }

                }, function( child ){
                    if( ifContinued ){
                        child.stdout.on('data', function (data) {
                            console.log( data.toString( 'utf8') );

                            taskCount++;

                            if( taskCount == taskLen ){
                                done();
                            }
                        });
                    }
                });
            });
        }
        else {
            grunt.log.warn( 'No task to run.' );
            done();
        }
    });
};
