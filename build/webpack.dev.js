const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base');

module.exports  = webpackMerge.merge(webpackBase, {
    mode: 'development',      // 模式，表示dev环境
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
    plugins: [
        new WebpackBar(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../public/dll/react-manifest.json')
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../public/dll/react.dll.js')
        })
    ]   
})
