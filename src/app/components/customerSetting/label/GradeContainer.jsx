'use strict';

import React from "react";
import GradeItem from './GradeItem.jsx';

var GradeContainer = React.createClass({
  propTypes: {
    labelGradeList: React.PropTypes.object,
    mergeLabel: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool,
    uom: React.PropTypes.string,
    order: React.PropTypes.number
  },
  getInitialState: function() {
    return {
    };
  },
  _isValid: function() {
    var labelGradeList = this.props.labelGradeList;
    var tempValid = true;
    var isValid = true;
    for (var i = 0; i < labelGradeList.size; i++) {
      tempValid = this.refs['gradeItem' + (i + 1)]._isValid();
      isValid = isValid && tempValid;
    }
    return isValid;
  },
  _mergeLabelItem: function(data) {
    var labelGradeList = this.props.labelGradeList;
    for (var i = 0; i < labelGradeList.size; i++) {
      if (this.refs['gradeItem' + (i + 1)].refs.MinValue) {
        this.refs['gradeItem' + (i + 1)].refs.MinValue.refs.TextField.setState({
          isFocused: false
        });
      }
      if (this.refs['gradeItem' + (i + 1)].refs.MaxValue) {
        this.refs['gradeItem' + (i + 1)].refs.MaxValue.refs.TextField.setState({
          isFocused: false
        });
      }
    }
    labelGradeList = labelGradeList.setIn([data.index, data.path], data.value);
    this.refs['gradeItem' + (data.index + 1)].refs[data.path].refs.TextField.setState({
      isFocused: true
    });
    if (data.path === 'MinValue') {
      if (this.props.order === 0) {
        labelGradeList = labelGradeList.setIn([data.index - 1, 'MaxValue'], data.value);
        this.refs['gradeItem' + (data.index)].refs.MaxValue.refs.TextField.setState({
          isFocused: true
        });
        this.refs['gradeItem' + (data.index)].refs.MaxValue.setState({
          errorText: this.refs['gradeItem' + (data.index + 1)].refs[data.path].state.errorText
        });
      } else if (this.props.order === 1) {
        labelGradeList = labelGradeList.setIn([data.index + 1, 'MaxValue'], data.value);
        this.refs['gradeItem' + (data.index + 2)].refs.MaxValue.refs.TextField.setState({
          isFocused: true
        });
        this.refs['gradeItem' + (data.index + 2)].refs.MaxValue.setState({
          errorText: this.refs['gradeItem' + (data.index + 1)].refs[data.path].state.errorText
        });
      }
    } else if (data.path === 'MaxValue') {
      if (this.props.order === 0) {
        labelGradeList = labelGradeList.setIn([data.index + 1, 'MinValue'], data.value);
        this.refs['gradeItem' + (data.index + 2)].refs.MinValue.refs.TextField.setState({
          isFocused: true
        });
        this.refs['gradeItem' + (data.index + 2)].refs.MinValue.setState({
          errorText: this.refs['gradeItem' + (data.index + 1)].refs[data.path].state.errorText
        });
      } else if (this.props.order === 1) {
        labelGradeList = labelGradeList.setIn([data.index - 1, 'MinValue'], data.value);
        this.refs['gradeItem' + (data.index)].refs.MinValue.refs.TextField.setState({
          isFocused: true
        });
        this.refs['gradeItem' + (data.index)].refs.MinValue.setState({
          errorText: this.refs['gradeItem' + (data.index + 1)].refs[data.path].state.errorText
        });
      }
    }
    this.props.mergeLabel({
      value: labelGradeList,
      path: 'LabellingItems'
    });
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var me = this;
    var labelGradeList = this.props.labelGradeList;
    var length = labelGradeList.size;
    var labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var gradeItems = labelGradeList.map(function(item, i) {
      let props = {
        index: i,
        key: i,
        ref: 'gradeItem' + (i + 1),
        labelValue: item,
        gradeLevel: i === (length - 1) ? 8 : (i + 1),
        gradeLabel: labels[i],
        mergeLabelItem: me._mergeLabelItem,
        uom: me.props.uom,
        order: me.props.order,
        isViewStatus: me.props.isViewStatus
      };
      return (
        <GradeItem {...props}/>
        );
    });
    return (<div className='jazz-customer-label-chart-text'>{gradeItems}</div>);
  }
});

module.exports = GradeContainer;
