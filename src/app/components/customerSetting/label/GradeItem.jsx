'use strict';

import React from "react";
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import Regex from '../../../constants/Regex.jsx';

var GradeContainer = React.createClass({
  propTypes: {
    labelValue: React.PropTypes.object,
    mergeLabelItem: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool,
    gradeLevel: React.PropTypes.number,
    gradeLabel: React.PropTypes.string,
    uom: React.PropTypes.string,
    order: React.PropTypes.number
  },
  getInitialState: function() {
    return {
    };
  },
  _isValid: function() {
    var minValueIsValid = true,
      maxValueIsValid = true;
    if (this.refs.MinValue) {
      minValueIsValid = this.refs.MinValue.isValid();
    }
    if (this.refs.MaxValue) {
      maxValueIsValid = this.refs.MaxValue.isValid();
    }
    return minValueIsValid && maxValueIsValid;
  },
  _renderItem: function(gradeLevel) {
    var me = this;
    var item = null;
    var labelValue = this.props.labelValue;

    var minValueProps = {
        ref: 'MinValue',
        isViewStatus: this.props.isViewStatus,
        defaultValue: labelValue.get('MinValue'),
        isRequired: true,
        regex: Regex.TagRule,
        errorMessage: I18N.Setting.Tag.ErrorContent,
        style: {
          'width': (this.props.gradeLevel === 1 || this.props.gradeLevel === 8) ? '200px' : '100px'
        },
        didChanged: value => {
          me.props.mergeLabelItem({
            value,
            path: "MinValue",
            index: me.props.index
          });
        }
      },

      maxValueProps = {
        ref: 'MaxValue',
        isViewStatus: this.props.isViewStatus,
        defaultValue: labelValue.get('MaxValue'),
        isRequired: true,
        regex: Regex.TagRule,
        errorMessage: I18N.Setting.Tag.ErrorContent,
        style: {
          'width': (this.props.gradeLevel === 1 || this.props.gradeLevel === 8) ? '200px' : '100px'
        },
        didChanged: value => {
          me.props.mergeLabelItem({
            value,
            path: "MaxValue",
            index: me.props.index
          });
        }
      };

    if (gradeLevel === 1) {
      if (this.props.order === 0) {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
        <div className='jazz-jazz-customer-label-grade-item-signal'>{'<='}</div>
        <ViewableTextField {...maxValueProps}/>
        <div className='jazz-jazz-customer-label-grade-item-uom'>{this.props.uom}</div>
      </div>);
      } else {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
      <div className='jazz-jazz-customer-label-grade-item-signal'>{'>'}</div>
      <ViewableTextField {...minValueProps}/>
      <div className='jazz-jazz-customer-label-grade-item-uom'>{this.props.uom}</div>
    </div>);
      }
    } else if (gradeLevel === 8) {
      if (this.props.order === 0) {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
        <div className='jazz-jazz-customer-label-grade-item-signal'>{'>'}</div>
        <ViewableTextField {...minValueProps}/>
        <div className='jazz-jazz-customer-label-grade-item-uom'>{this.props.uom}</div>
      </div>);
      } else {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
      <div className='jazz-jazz-customer-label-grade-item-signal'>{'<='}</div>
      <ViewableTextField {...maxValueProps}/>
      <div className='jazz-jazz-customer-label-grade-item-uom'>{this.props.uom}</div>
      </div>);
      }
    } else {
      if (this.props.order === 0) {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
        <ViewableTextField {...minValueProps}/>
        <div className='jazz-jazz-customer-label-grade-item-to'>{'-'}</div>
        <ViewableTextField {...maxValueProps}/>
        <div className='jazz-jazz-customer-label-grade-item-uom'>{this.props.uom}</div>
      </div>);
      } else {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
      <ViewableTextField {...maxValueProps}/>
      <div className='jazz-jazz-customer-label-grade-item-to'>{'-'}</div>
      <ViewableTextField {...minValueProps}/>
      <div className='jazz-jazz-customer-label-grade-item-uom'>{this.props.uom}</div>
    </div>);
      }
    }
    return item;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var labelValue = this.props.labelValue;
    var content = this._renderItem(this.props.gradeLevel);
    return content;
  }
});

module.exports = GradeContainer;
