'use strict';
import React from "react";
import assign from "object-assign";
import CommonFuns from '../../util/Util.jsx';
import { FontIcon, IconButton, DropDownMenu, Dialog, RaisedButton, CircularProgress } from 'material-ui';

let StepItem = React.createClass({
  _onStepClick() {
    if (this.props.onStepChange && !this.props.disabled) {
      this.props.onStepChange(this.props.step);
    }
  },
  render: function() {
    var me = this;
    var className = 'jazz-energy-step-item ' + (this.props.selected && !this.props.disabled? 'jazz-energy-step-item-selected' : '')+''
                    +(this.props.disabled?'jazz-energy-step-item-disable':'');
    return <div className={className} onClick={me._onStepClick}> {this.props.text}</div>;
  }

});

var ALLSTEPITEMS = null;

function loadStepItems() {
  ALLSTEPITEMS = [{
    val: 'minute',
    text: I18N.EM.Raw,
    step: 0
  },
    {
      val: 'hour',
      text: I18N.EM.Hour,
      step: 1
    },
    {
      val: 'day',
      text: I18N.EM.Day,
      step: 2
    },
    {
      val: 'week',
      text: I18N.EM.Week,
      step: 5
    },
    {
      val: 'month',
      text: I18N.EM.Month,
      step: 3
    },
    {
      val: 'year',
      text: I18N.EM.Year,
      step: 4
    }
  ];

}

function getStepItems() {
  //  if(!ALLSTEPITEMS){
  loadStepItems();
  //  }
  return ALLSTEPITEMS;
}

let StepSelector = React.createClass({
  _onStepChange(step) {
    if (this.props.onStepChange) {
      this.props.onStepChange(step);
    }
  },
  getDefaultProps() {
    return {
      timeRanges: [],
      disabled:false
    };
  },
  getInitialState() {
    let limitInterval = CommonFuns.getLimitInterval(this.props.timeRanges);
    var stepList = limitInterval.stepList;
    if (this.props.minStep) {
      stepList = this.getStepList(stepList, this.props.minStep);
    }
    limitInterval.stepList = stepList;
    return limitInterval;
  },
  componentWillReceiveProps(){
    let limitInterval = CommonFuns.getLimitInterval(this.props.timeRanges);
    var stepList = limitInterval.stepList;
    if (this.props.minStep) {
      stepList = this.getStepList(stepList, this.props.minStep);
    }
    limitInterval.stepList = stepList;
    this.setState(limitInterval)
  },
  getStepList(stepList, minStep) {
    var newStepList = [];
    for (var i = 0; i < stepList.length; i++) {
      if (stepList[i] >= minStep) {
        newStepList.push(stepList[i]);
      }
    }
    return newStepList;
  },
  render() {
    var me = this;
    var selectedStep = this.props.stepValue;

    let stepList = this.state.stepList,
      stepElementList = [],
      stepItem,
      allItems = getStepItems();

    for (let i = 0, len = allItems.length; i < len; i++) {
      stepItem = allItems[i];
      if (stepList.indexOf(stepItem.step) > -1) {
        let obj = assign({}, stepItem);
        if (selectedStep === stepItem.step) {
          obj.selected = true;
        } else {
          obj.selected = false;
        }

        obj.disabled=this.props.disabled;
        stepElementList.push(<StepItem {...obj} onStepChange={me._onStepChange}></StepItem>);
      }
    }
    return <div className='jazz-energy-step'>
      {stepElementList}
    </div>;
  }

});

module.exports = StepSelector;
