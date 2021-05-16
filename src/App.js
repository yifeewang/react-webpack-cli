import React, { Component } from 'react';
import style from './App.less';
import { DatePicker, Space } from 'antd';
function onChange(date, dateString) {
  console.log(date, dateString);
}

class App extends React.Component {

  render() {
    return (
    <Space direction="vertical">
        <DatePicker onChange={onChange} />
        <DatePicker onChange={onChange} picker="week" />
        <DatePicker onChange={onChange} picker="month" />
        <DatePicker onChange={onChange} picker="quarter" />
        <DatePicker onChange={onChange} picker="year" />
    </Space>
    );
  }
}

export default App;