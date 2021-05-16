// webpack 默认配置
const path = require('path');
// 压缩 Css 文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 用于处理多路径文件，使用purifycss的时候要用到glob.sync方法。
const glob = require('glob-all')
// Css tree shanking 摇树
const purifyCssWebpack = require('purifycss-webpack')
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base');

module.exports = webpackMerge.merge(webpackBase, {
    mode: 'production',
    plugins: [
        // 压缩css文件
        new OptimizeCssAssetsWebpackPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                // 去掉注释
                preset: ["default", { discardComments: { removeAll: true } }]
            }
        }),
        //css tree shaking
        new purifyCssWebpack({
            paths: glob.sync([
                path.resolve(__dirname, '../src/*html'),
                path.resolve(__dirname, '../src/*js')
            ])
        }),
    ],
    optimization: {
        // js 开启 tree shanking
        usedExports: true,
        splitChunks: {
            chunks: "all", // 默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
            minSize: 30000,  //表示在压缩前的最小模块大小,默认值是30kb
            minChunks: 1,  // 表示被引用次数，默认为1；
            maxAsyncRequests: 5,  //所有异步请求不得超过5个
            maxInitialRequests: 3,  //初始话并行请求不得超过3个
            automaticNameDelimiter:'~',//名称分隔符，默认是~
            name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
            cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
                common: {
                    name: 'common',  //抽取的chunk的名字
                    priority: 10,  //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
                    minChunks: 2,  //最少被几个chunk引用
                    reuseExistingChunk: true,//  如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                    enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
                }
            }
        }        
    }, 
})
