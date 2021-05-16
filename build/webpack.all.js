const path = require('path');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports  = {
    mode: 'development',      // 模式，表示dev环境
    entry: {
        index: ['webpack-hot-middleware/client?noInfo=true&reload=true', './src/index.js']
    },
    output: {
        filename: 'bundle_[hash:8].js',  // 打包后文件名称
        path: path.resolve(__dirname, '../dist') // 打包后文件夹存放路径
    },
    resolve: {
        // 规定在那里寻找第三方模块
        modules: [path.resolve(__dirname, '../node_modules')],
        // 别名
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 自动补齐后缀名
        extensions: ['.js', '.jsx', '.css', '.less', '.jon']
    }, 
    devServer: {
        // 指向打包后的文件地址
        contentBase: path.resolve(__dirname, '../dist'),
        // 是否自动打开一个新窗口
        open: true,
        // 端口号
        port: 8080,
        // 是否开启热更新
        hot: true,
        // 启用热模块替换，而不会在构建失败时将页面刷新作为后备。
        hotOnly: true
    },    
    module: {
        rules: [
            {
                test: /\.js$/,   
                exclude: /node_modules/, // 排除node_modules中的代码
                use: [{
                    loader: 'babel-loader'
                }],
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                // include: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            //  您可以在此处指定publicPath
                            //  默认情况下，它在webpackOptions.output中使用publicPath
                            publicPath: path.resolve(__dirname, '../dist')
                        }

                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    }, 'postcss-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }, 
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]', // placeholder 占位符
                        outputPath: 'images/', // 打包文件名
                        limit: 204800, // 小于200kb则打包到js文件里，大于则使用file-loader的打包方式打包到imgages里
                    },
                },
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash:5].min.[ext]', // 和上面同理
                        outputPath: 'fonts/',
                        limit: 5000,
                    }
                },
            }
        ]
    }, 
    plugins: [
        // 复制一个 html 并将最后打包好的资源在 html 中引入
        new HtmlWebpackPlugin({
            // 页面title 需要搭配 ejs 使用
            title: "webpack-react-demo",
            // html 模板路径
            template: path.resolve(__dirname, "../public/index.html"),
            // 输出文件名称
            filename: "index.html",
            minify: {
                // 压缩HTML⽂件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空⽩符与换⾏符
                minifyCSS: true // 压缩内联css
            }
        }),
        // 每次部署时清空 dist 目录
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name]_[contenthash:6].css",
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../public/dll/react-manifest.json')
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../public/dll/react.dll.js')
        })
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
}
