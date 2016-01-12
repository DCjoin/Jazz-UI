'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';
import CommonFuns from '../util/Util.jsx';
import FromEndDate from './FromEndDate.jsx';
import FlatButton from './FlatButton.jsx';

var FromEndDateItem = React.createClass({
  getInitialState: function() {
    return {
      typeValue: this.props.typeValue,
      startMonth: this.props.startMonth,
      startDay: this.props.startDay,
      endMonth: this.props.endMonth,
      endDay: this.props.endDay
    };
  },
  isValid: function() {
    return this.refs.fromEndDate.isValid();
  },
  _onTypeChange: function(value) {
    this.setState({
      typeValue: value
    });
  },
  getTypeValue: function() {
    return this.state.typeValue;
  },
  _onDateChange: function(startMonth, startDay, endMonth, endDay) {
    this.setState({
      startMonth: startMonth,
      startDay: startDay,
      endMonth: endMonth,
      endDay: endDay
    });
  },
  getCompareValue: function() {
    this.refs.fromEndDate.getCompareValue();
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      typeValue: nextProps.typeValue,
      startMonth: nextProps.startMonth,
      startDay: nextProps.startDay,
      endMonth: nextProps.endMonth,
      endDay: nextProps.endDay
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      CommonFuns.CompareArray(this.props.typeItems, nextProps.typeItems) &&
      this.props.typeValue === nextProps.typeValue &&
      this.props.typeText === nextProps.typeText &&
      this.props.startMonth === nextProps.startMonth &&
      this.props.startDay === nextProps.startDay &&
      this.props.endMonth === nextProps.endMonth &&
      this.props.endDay === nextProps.endDay &&
      this.state.typeValue === nextState.typeValue &&
      this.state.startMonth === nextState.startMonth &&
      this.state.startDay === nextState.startDay &&
      this.state.endMonth === nextState.endMonth &&
      this.state.endDay === nextState.endDay) {
      return false;
    }
    return true;
  },
  render: function() {
    var me = this;
    var typeProps = {
      ref: 'type',
      dataItems: me.props.typeItems,
      isViewStatus: me.props.isViewStatus,
      defaultValue: me.state.typeValue,
      title: '',
      textField: 'text',
      didChanged: me._onTypeChange
    };
    var dateProps = {
      ref: 'fromEndDate',
      index: me.props.index,
      isViewStatus: me.props.isViewStatus,
      startMonth: me.state.startMonth,
      startDay: me.state.startDay,
      endMonth: me.state.endMonth,
      endDay: me.state.endDay,
      onDateChange: me._onDateChange
    };
    return (
      <div className='jazz-fromenddate-item'>
        <div className='jazz-fromenddate-item-type'>
          <div className='jazz-fromenddate-item-text'>{me.props.typeText}</div>
          <ViewableDropDownMenu {...typeProps}></ViewableDropDownMenu>
        </div>
        <div className='jazz-fromenddate-item-date'>
          <div className='jazz-fromenddate-item-text'>{I18N.Setting.Calendar.TimeRange}</div>
          <FromEndDate {...dateProps}></FromEndDate>
        </div>
      </div>
      );
  }
});

module.exports = FromEndDateItem;
