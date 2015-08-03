'use strict';
import React from "react";
import Immutable from 'immutable';
import ChartMixins from '../energy/ChartMixins.jsx';


const searchDate = [{value:'Customerize',text:'自定义'},{value: 'Last7Day', text: '最近7天'}, {value: 'Last30Day', text: '最近30天'}, {value: 'Last12Month', text: '最近12月'},
 {value: 'Today', text: '今天'}, {value: 'Yesterday', text: '昨天'}, {value: 'ThisWeek', text: '本周'}, {value: 'LastWeek', text: '上周'},
 {value: 'ThisMonth', text: '本月'}, {value: 'LastMonth', text: '上月'}, {value: 'ThisYear', text: '今年'}, {value: 'LastYear', text: '去年'}];

let ChartPanel = React.createClass({
    mixins:[ChartMixins],
    propTypes:{
      chartTitle:  React.PropTypes.string
    },
    render(){
      
    }

});

module.exports = ChartPanel;
