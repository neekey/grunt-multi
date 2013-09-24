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
                        ChildProcess.exec( 'npm install', function (error, stdout, stderr) {
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
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
        ChildProcess.exec( 'grunt multi:list --debug', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
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
        ChildProcess.exec( 'grunt multi:pattern --debug', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
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
        ChildProcess.exec( 'grunt multi:external --debug', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
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
        ChildProcess.exec( 'grunt multi:constant --debug', function (error, stdout, stderr) {
            console.log( stdout);
            console.log( stderr);
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
        ChildProcess.exec( 'grunt multi:constant_func --debug', function (error, stdout, stderr) {
            console.log( stdout);
            console.log( stderr);
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
        ChildProcess.exec( 'grunt multi:func --debug', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
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
        ChildProcess.exec( 'grunt multi:command --multi-vars page_list=a,b,c:out_target=mod2.js --debug ', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
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

});


function assertFiles( files ){
    files.forEach(function( file ){
        Assert.strictEqual( FS.existsSync( file ), true );
    });
}