import React from 'react';
import ReactDom from 'react-dom';
import App from './App.js';

if (module.hot) {
    // 一旦 module.hot 为true，说明开启了HMR功能。 
    // 额外添加下面的JS代码
    // 让HMR功能代码在此JS文件修改时生效
    module.hot.accept('./App.js', function() {
      // 方法会监听 print.js 文件的变化
      // 一旦发生变化，其他模块不会重新打包构建。
      // 会执行后面的回调函数
      ReactDom.render(<App />, document.getElementById('root'));
    });
  }

// 需要在 index.html 中增加一个 div标签 id 设置为 'app'
ReactDom.render(<App />, document.getElementById('root'));
