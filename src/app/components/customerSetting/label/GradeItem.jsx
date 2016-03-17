'use strict';

import React from "react";
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import Regex from '../../../constants/Regex.jsx';
import classnames from "classnames";

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
      errorText: ''
    };
  },
  _isValid: function() {
    var minValueIsValid = true,
      maxValueIsValid = true;
    var labelValue = this.props.labelValue;
    var errorStr;
    if (this.props.order === 0) {
      errorStr = I18N.Setting.CustomizedLabeling.ErrorMessage1;
    } else {
      errorStr = I18N.Setting.CustomizedLabeling.ErrorMessage2;
    }
    if (this.refs.MinValue) {
      minValueIsValid = this.refs.MinValue.isValid();
    }
    if (this.refs.MaxValue) {
      maxValueIsValid = this.refs.MaxValue.isValid();
    }
    if (this.refs.MinValue && this.refs.MaxValue) {
      if (minValueIsValid && maxValueIsValid) {
        if (labelValue.get('MinValue') >= labelValue.get('MaxValue')) {
          this.setState({
            errorText: errorStr
          });
          return false;
        } else {
          this.setState({
            errorText: ''
          });
        }
      } else {
        this.setState({
          errorText: ''
        });
      }
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
        },
        didFocus: () => {
          me.props.onFocus({
            path: "MinValue",
            index: me.props.index
          });
        },
        didBlur: me.props.onBlur
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
        },
        didFocus: () => {
          me.props.onFocus({
            path: "MaxValue",
            index: me.props.index
          });
        },
        didBlur: me.props.onBlur
      };

    if (gradeLevel === 1) {
      if (this.props.order === 0) {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
        <div className={classnames({
          'jazz-jazz-customer-label-grade-item-signal': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{'<='}</div>
        <ViewableTextField {...maxValueProps}/>
        <div className={classnames({
          'jazz-jazz-customer-label-grade-item-uom': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{this.props.uom}</div>
      </div>);
      } else {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
      <div className={classnames({
          'jazz-jazz-customer-label-grade-item-signal': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{'>'}</div>
      <ViewableTextField {...minValueProps}/>
      <div className={classnames({
          'jazz-jazz-customer-label-grade-item-uom': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{this.props.uom}</div>
    </div>);
      }
    } else if (gradeLevel === 8) {
      if (this.props.order === 0) {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
        <div className={classnames({
          'jazz-jazz-customer-label-grade-item-signal': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{'>'}</div>
        <ViewableTextField {...minValueProps}/>
        <div className={classnames({
          'jazz-jazz-customer-label-grade-item-uom': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{this.props.uom}</div>
      </div>);
      } else {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
      <div className={classnames({
          'jazz-jazz-customer-label-grade-item-signal': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{'<='}</div>
      <ViewableTextField {...maxValueProps}/>
      <div className={classnames({
          'jazz-jazz-customer-label-grade-item-uom': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{this.props.uom}</div>
      </div>);
      }
    } else {
      if (this.props.order === 0) {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
        <ViewableTextField {...minValueProps}/>
        <div className={classnames({
          'jazz-jazz-customer-label-grade-item-to': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{'-'}</div>
        <ViewableTextField {...maxValueProps}/>
        <div className={classnames({
          'jazz-jazz-customer-label-grade-item-uom': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{this.props.uom}</div>
      </div>);
      } else {
        item = (<div className='jazz-jazz-customer-label-grade-item'>
      <ViewableTextField {...maxValueProps}/>
      <div className={classnames({
          'jazz-jazz-customer-label-grade-item-to': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{'-'}</div>
      <ViewableTextField {...minValueProps}/>
      <div className={classnames({
          'jazz-jazz-customer-label-grade-item-uom': true,
          "jazz-jazz-customer-label-grade-item-edit": !this.props.isViewStatus,
          "jazz-jazz-customer-label-grade-item-view": this.props.isViewStatus
        })}>{this.props.uom}</div>
    </div>);
      }
    }
    return item;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.isViewStatus) {
      this.setState({
        errorText: ''
      });
    }
  },
  componentWillUnmount: function() {},
  render: function() {
    var content = this._renderItem(this.props.gradeLevel);
    let errorTextElement = this.state.errorText !== '' ? (
      <div className='jazz-jazz-customer-label-grade-item-error'>{this.state.errorText}</div>
      ) : null;
    return <div>
      {content}
      {errorTextElement}
    </div>;
  }
});

module.exports = GradeContainer;
