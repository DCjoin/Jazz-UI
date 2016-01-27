'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FontIcon } from 'material-ui';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';
import CommonFuns from '../util/Util.jsx';
import FromEndDate from './FromEndDate.jsx';
import FlatButton from './FlatButton.jsx';

var FromEndDateItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    isViewStatus: React.PropTypes.bool,
    hasDeleteButton: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    typeValue: React.PropTypes.number,
    typeItems: React.PropTypes.array,
    typeText: React.PropTypes.string,
    startMonth: React.PropTypes.number,
    startDay: React.PropTypes.number,
    endMonth: React.PropTypes.number,
    endDay: React.PropTypes.number
  },
  getDefaultProps() {
    return {
      startMonth: -1,
      startDay: -1,
      endMonth: -1,
      endDay: -1,
      errorText: '',
      hasDeleteButton: true
    };
  },
  isValid: function() {
    return this.refs.fromEndDate.isValid();
  },
  _onTypeChange: function(value) {
    this.props.onTypeChange(this.props.index, value);
  },
  _onDateChange: function(startMonth, startDay, endMonth, endDay) {
    var dateData = {
      startMonth: startMonth,
      startDay: startDay,
      endMonth: endMonth,
      endDay: endDay
    };
    this.props.onDateChange(this.props.index, dateData);
  },
  setErrorText: function(errorText) {
    this.props.setErrorText(this.props.index, errorText);
  },
  clearInvalide: function() {
    this.setErrorText('');
  },
  _onDeleteDateData: function() {
    this.props.onDeleteDateData(this.props.index);
  },
  getCompareValue: function() {
    return this.refs.fromEndDate.getCompareValue();
  },
  getTypeValue: function() {
    return this.props.typeValue;
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      CommonFuns.CompareArray(this.props.typeItems, nextProps.typeItems) &&
      this.props.typeValue === nextProps.typeValue &&
      this.props.typeText === nextProps.typeText &&
      this.props.hasDeleteButton === nextProps.hasDeleteButton &&
      this.props.errorText === nextProps.errorText &&
      this.props.startMonth === nextProps.startMonth &&
      this.props.startDay === nextProps.startDay &&
      this.props.endMonth === nextProps.endMonth &&
      this.props.endDay === nextProps.endDay &&
      this.props.lang === nextProps.lang) {
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
      defaultValue: me.props.typeValue,
      title: '',
      textField: 'text',
      didChanged: me._onTypeChange
    };
    var dateProps = {
      ref: 'fromEndDate',
      index: me.props.index,
      isViewStatus: me.props.isViewStatus,
      startMonth: me.props.startMonth,
      startDay: me.props.startDay,
      endMonth: me.props.endMonth,
      endDay: me.props.endDay,
      lang: me.props.lang,
      onDateChange: me._onDateChange
    };
    var cleanIconStyle = {
      fontSize: '16px'
    };
    var deleteButton = null;
    if (!me.props.isViewStatus && me.props.hasDeleteButton) {
      deleteButton = <div className='jazz-fromenddate-item-type-delete'><FlatButton secondary={true} label={I18N.Common.Button.Delete} onClick={me._onDeleteDateData} style={{
        background: 'transparent'
      }} /></div>;
    }
    return (
      <div className='jazz-fromenddate-item'>
        <div className='jazz-fromenddate-item-type'>
          <div className='jazz-fromenddate-item-type-text'>{me.props.typeText}</div>
          {deleteButton}
        </div>
        <ViewableDropDownMenu {...typeProps}></ViewableDropDownMenu>
        <div className='jazz-fromenddate-item-text'>{I18N.Setting.Calendar.TimeRange}</div>
        <FromEndDate {...dateProps}></FromEndDate>
        <div className="jazz-fromenddate-item-error">{me.props.errorText}</div>
      </div>
      );
  }
});

module.exports = FromEndDateItem;
