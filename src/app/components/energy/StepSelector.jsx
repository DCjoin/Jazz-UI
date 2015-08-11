'use strict';
import React from "react";
import assign from "object-assign";
import CommonFuns from '../../util/Util.jsx';
import {FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress} from 'material-ui';

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
                     ];
const orderItem = [{value:'1',text:'降序'}, {value:'2',text:'升序'}];
const rangeItem = [{value:'3',text:'前3名'},{value:'5',text:'前5名'},{value:'10',text:'前10名'},
{value:'20',text:'前20名'},{value:'50',text:'前50名'},{value:'1000',text:'全部'}];

let StepSelector = React.createClass({
  _onStepChange(step){
    if(this.props.onStepChange){
      this.props.onStepChange(step);
    }
  },
  _onOrderChange(e, selectedIndex, menuItem){
    var order = selectedIndex + 1;
    if(this.props.onOrderChange){
      this.props.onOrderChange(order);
    }
  },
  _onRangeChange(e, selectedIndex, menuItem){
    var range = menuItem.value;
    if(this.props.onRangeChange){
      this.props.onRangeChange(range);
    }
  },
  getDefaultProps(){
    return {stepItems: ALLSTEPITEMS, timeRanges:[]};
  },
  getInitialState(){
    if(this.props.bizType !== 'Rank'){
      let limitInterval = CommonFuns.getLimitInterval(this.props.timeRanges);
      return limitInterval;
    }
    else{
      return null;
    }
  },
  render(){
    var me = this;

    if(this.props.bizType !== 'Rank'){
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
    else{
      var orderCombo = <DropDownMenu menuItems={orderItem} ref='orderCombo' onChange={me._onOrderChange}></DropDownMenu>;
      var rangeCombo = <DropDownMenu menuItems={rangeItem} ref='rangeCombo' onChange={me._onRangeChange}></DropDownMenu>;
      return <div className='jazz-energy-step'>
        {orderCombo}
        {rangeCombo}
      </div>;
    }
  }

});

module.exports = StepSelector;
