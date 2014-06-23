/**
 * 与任务配置有关的一些公用方法
 */
var SPAWN_COUNT = 0;
var SPAWN_PENDING_LIST = [];
var SPAWN_MAX_LIVE = 4;

var Utils = module.exports = {
    /**
     * 获取当前用户任务
     * @returns {*}
     */
    getTaskName: function(){
        // 0: none
        // 1: grunt
        // 2: task
        return process.argv[ 2 ];
    },

    /**
     * 1、对grunt.util.spawn的封装，添加一个 --child-grunt 标志，用于区分子进程
     * 2、同是只有4个子进程在运行
     * @param grunt
     * @param cfg
     * @param done
     * @param ready
     */
    spawn: function( grunt, cfg, done, ready ){

        var self = this;

        if( !cfg.args ){
            cfg.args = [];
        }

        // 检查是否可以马上执行
        if( SPAWN_COUNT < SPAWN_MAX_LIVE || cfg.force ){
            SPAWN_COUNT++;

            grunt.log.ok('Spawning new grunt-multi process');

            var child = grunt.util.spawn( cfg, function(){
                process.nextTick(function(){
                    if( SPAWN_PENDING_LIST.length ){
                        var task = SPAWN_PENDING_LIST.shift();
                        self.spawn( grunt, task.cfg, task.done, task.ready );
                    }
                });

                SPAWN_COUNT--;
                done.apply( this, arguments );
            });

            ready && ready( child );
        }
        else {
            SPAWN_PENDING_LIST.push( {
                cfg: cfg,
                done: done,
                ready: ready
            });
        }
    }
};

Utils.spawn.setMax = function( max ){
    SPAWN_MAX_LIVE = max || SPAWN_MAX_LIVE;
};
