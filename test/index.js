/**
 * 针对 初始化 任务的文件以及内容检查
 */

var FS = require('fs-extra');
var Path = require('path');
var ChildProcess = require( 'child_process' );
var Assert = require( 'assert' );

describe('grunt-multi TEST', function () {

    beforeEach(function( done ){

        process.chdir( __dirname );

        var mockDirPath = Path.resolve( __dirname, 'project' )
        var targetDirPath = Path.resolve( __dirname, 'tmp' );

        FS.remove( targetDirPath, function( err ){
            if( err ){
                done( err )
            }
            else {
                FS.copy( mockDirPath, targetDirPath, function( err ){

                    if( err ){
                        done( err );
                    }
                    else {
                        process.chdir( targetDirPath );

                        // 先安装npm 依赖
                        exec( 'npm install', function (error, stdout, stderr) {
                            if (error) {
                                done( error );
                            }
                            else {
                                done(null);
                            }
                        });
                    }
                });
            }
        });
    });

    it('USE List', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:list --debug', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod1.js'
                ]);
                done(null);
            }
        });
    });

    it('USE pattern', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:pattern --debug', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod1.js'
                ]);
                done(null);
            }
        });
    });

    it('USE external', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:external --debug', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod1.js'
                ]);
                done(null);
            }
        });
    });

    it('USE constant', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:constant --debug', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod2.js'
                ]);
                done(null);
            }
        });
    });

    it('USE config func', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:constant_func --debug', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod2.js'
                ]);
                done(null);
            }
        });
    });

    it('USE func', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:func --debug', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod1.js'
                ]);
                done(null);
            }
        });
    });

    it('USE Command', function (done) {

        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:command --page_list a,b,c --out_target mod2.js --debug ', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod2.js'
                ]);
                done(null);
            }
        });
    });

    it( 'logBegin logEnd', function( done ){


        // 执行grunt
        // 先安装npm 依赖
        exec( 'grunt multi:log --debug ', function (error, stdout, stderr) {
            if (error) {
                done( error );
            }
            else {
                assertFiles( [
                    'build/a/app.js',
                    'build/a/index.js',
                    'build/b/home.js',
                    'build/b/profile.js',
                    'build/c/dashboard.js',
                    'build/c/list.js',
                    'build/mod1.js'
                ]);
                done(null);
            }
        });
    });
});


function assertFiles( files ){
    files.forEach(function( file ){
        Assert.strictEqual( FS.existsSync( file ), true );
    });
}

function exec( cmd, next ){
    var child = ChildProcess.exec( cmd, next );
    child.stdout.pipe( process.stdout );
    child.stderr.pipe( process.stderr );
}