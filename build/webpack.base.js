const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
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
            'src': path.resolve(__dirname, '../src'),
            '@': path.resolve(__dirname, '../node_modules')
        },
        // 自动补齐后缀名
        extensions: ['.js', '.jsx', '.css', '.less', '.jon']
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
                            importLoaders: 2,
                            modules: true
                        }
                    }, 
                    'postcss-loader', 
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                            modifyVars: {'@primary-color': '#1DA57A'}
                        }
                    }
                ]
            },
            {//一般文件样式处理
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    }, 
                    'postcss-loader'
                ]
            },
            {//antd样式处理, 因为cssmodules与antd必须分开处理，否则导致antd样式失效
                test:/\.css$/,
                exclude:/src/,
                include: /node_modules/,
                use:[
                    { loader: "style-loader",},
                    {
                        loader: "css-loader",
                        options:{
                            importLoaders:1
                        }
                    }
                ]
            },  
            {//antd样式处理
                test: /\.less$/,
                exclude: /src/,
                include: /node_modules/,
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
                            importLoaders: 2,
                        }
                    }, 
                    'postcss-loader', 
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                            modifyVars: {'@primary-color': '#1DA57A'}
                        }
                    }
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
        })
    ],
}
