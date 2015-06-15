'use strict';
import React from "react";
import assign from "object-assign";
import CommonFuns from '../../util/Util.jsx';

let StepItem = React.createClass({
  _onStepClick(){
    if(this.props.onStepChange){
      this.props.onStepChange(this.props.step);
    }
  },
  render: function () {
    var me = this;
    var className = 'jazz-energy-step-item ' + (this.props.selected ? 'jazz-energy-step-item-selected':'');
    return <div className={className} onClick={me._onStepClick}> {this.props.text}</div>;
  }

});

const ALLSTEPITEMS = [ {val: 'minute', text: '分钟', step: 0},
                       {val: 'hour', text: '小时', step: 1},
                       {val: 'day', text: '天', step: 2},
                       {val: 'week', text: '周', step: 5},
                       {val: 'month', text: '月', step: 3},
                       {val: 'year', text: '年', step: 4}
                     ],
      FIXEDTIMES = {
                      millisecond: 1,
                      second: 1000,
                      minute: 60 * 1000,
                      hour: 3600 * 1000,
                      day: 24 * 3600 * 1000,
                      week: 7 * 24 * 3600 * 1000,
                      month: 31 * 24 * 3600 * 1000,
                      year: 366 * 24 * 3600 * 1000
                   };

let StepSelector = React.createClass({
  _onStepChange(step){
    if(this.props.onStepChange){
      this.props.onStepChange(step);
    }
  },
  getInterval: function (start, end) {
    if (end < start) return;
    var ft = FIXEDTIMES;
    var lvs = [];
    lvs.push(ft.day); // 1day
    lvs.push(ft.week); //1week
    lvs.push(31 * ft.day); //1month 31day
    lvs.push(31 * 3 * ft.day); //3month 93day
    lvs.push(ft.year); // 1year
    lvs.push(2 * ft.year); // 2year
    lvs.push(10 * ft.year); // 5year

    var diff = end - start;
    var interval = {};
    var i;
    for (i = 0; i < lvs.length; i++) {
        if (diff <= lvs[i]) {
            break;
        }
    }
    var list = [], display, gridList = [];
    //1-Hourly,2-Daily,3-Monthly,4-Yearly,5-Weekly
    switch (i) {
        case 0: //<=1day
            list = [0, 1];//can raw & hour
            gridList = [0, 1];//can raw & hour
            display = 1; //default hour
            break;
        case 1: //<=1week
            list = [0, 1, 2]; //can raw & hour & day
            gridList = [0, 1, 2]; //can raw & hour & day
            display = 2; //default day
            break;
        case 2: //<=1month
            list = [0, 1, 2, 5]; //can raw & hour & day & week
            gridList = [0, 1, 2, 5];//can raw & hour & day & week
            display = 2; //default day
            break;
        case 3: //<=3month
            list = [0, 1, 2, 3, 5]; //can raw & hour & day & month & week
            gridList = [0, 1, 2, 3, 5];//can raw & hour & day & month & week
            display = 3; //default month
            break;
        case 4: //<=1year
            list = [1, 2, 3, 5]; //can hour & day & month & week
            gridList = [1, 2, 3, 5];//can hour & day & month & week
            display = 3; //default month
            break;
        case 5: //<=2year
        case 6://<=10year
            list = [2, 3, 4, 5]; //can day & month & year & week
            gridList = [2, 3, 4, 5];//can day & month & year & week
            display = 3; //default month
            break;
    }
    interval.stepList = list;
    interval.display = display;
    interval.gridList = gridList;
    return interval;
  },
  getLimitInterval(){
    let timeRange = this.props.timeRanges[0];
    let j2d = CommonFuns.DataConverter.JsonToDateTime;

    let startTime = j2d(timeRange.StartTime, true),
        endTime = j2d(timeRange.EndTime, true);

    let interval = this.getInterval(startTime, endTime);
    return interval;
  },
  getDefaultProps(){
    return {stepItems: ALLSTEPITEMS, timeRanges:[]};
  },
  getInitialState(){
    let limitInterval = this.getLimitInterval();
    return limitInterval;
  },
  componentWillReceiveProps(nextProps){
    console.log('==componentWillReceiveProps==',nextProps);
  },
  render(){
    var me = this;
    var selectedStep = this.props.stepValue;

    let stepList = this.state.stepList,
        stepElementList = [],
        stepItem;

    for(let i = 0, len = ALLSTEPITEMS.length; i<len; i++){
        stepItem = ALLSTEPITEMS[i];
        if(stepList.indexOf(stepItem.step)> -1){
          let obj = assign({},stepItem);
          if(selectedStep === stepItem.step){
            obj.selected = true;
          }else{
            obj.selected = false;
          }

          stepElementList.push(<StepItem {...obj} onStepChange={me._onStepChange}></StepItem>);
        }
    }

    return <div className='jazz-energy-step'>
      {stepElementList}
    </div>;
  }

});

module.exports = StepSelector;
