const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware")
const config = process.env.NODE_ENV === "dev" 
                ? require('./build/webpack.dev.js')
                : require('./build/webpack.prod.js');

const compiler = webpack(config);   // 编译器，编译器执行一次就会重新打包一下代码
const app = express();  // 生成一个实例
const DIST_DIR = path.resolve(__dirname, './dist');  // 设置静态访问文件路径

var devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    quiet: true,//向控制台显示内容
    stats: {
        colors: true
    },
  })
  
var hotMiddleware = webpackHotMiddleware(compiler, {
log: () => {console.log("hothothot")}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    console.log("开始编译")
})
compiler.plugin("done", () => {
    console.log("编译结束")
})
compiler.watch({
    ignored: '**/node_modules',
    aggregateTimeout: 300,
    poll: 1000,
}, (err, stats) => {
    // Print watch/build result here...
    console.log(4444, "has changed");
});

app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// 设置访问静态文件的路径
app.use(express.static(DIST_DIR));

app.listen(8080, () => {
    console.log("成功启动：localhost:"+ 8080)
});  //监听端口
