'use strict';
import React from "react";

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

let StepSelector = React.createClass({
  _onStepChange(step){
    if(this.props.onStepChange){
      this.props.onStepChange(step);
    }
  },
  getDefaultProps(){
    let items = [ {val: 'minute', text: '分钟', step: 0},
                  {val: 'hour', text: '小时', step: 1},
                  {val: 'day', text: '天', step: 2},
                  {val: 'week', text: '周', step: 5},
                  {val: 'month', text: '月', step: 3},
                  {val: 'year', text: '年', step: 4}];
    return {stepItems: items};
  },
  render(){
    var me = this;
    var selectedStep = this.props.stepValue;
    let items = this.props.stepItems.map(item => {
      if(selectedStep === item.step){
        item.selected = true;
      }else{
        item.selected = false;
      }
      return <StepItem {...item} onStepChange={me._onStepChange}></StepItem>;
    });

    return <div className='jazz-energy-step'>
      {items}
    </div>;
  }

});

module.exports = StepSelector;
