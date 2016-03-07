'use strict';

import React from "react";
import { Checkbox } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import MonitorTag from './MonitorTag.jsx';

var TagFormula = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object,
    mergeTag: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
    };
  },
  validateFormula: function(exp) {
    var regStr = /(-\d+)(\.\d+)?/g; //匹配负浮点数
    var regStr1 = /\{[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\#\&\,\:\;\.\~\+\%\\\/\|]*\}/g;
    var regStr2 = /-\{[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\#\&\,\:\;\.\~\+\%\\\/\|]*\}/g;
    //var regStr3 = /^[\+|-|\*|\/]{1}\{[A-z]+[A-z0-9]*\}$/; //匹配‘{}’在公式结尾

    exp = exp.replace(/\s+/g, ''); //替换空白字符

    exp = exp.replace(regStr2, '+(8)'); //-tag替换成正常量
    exp = exp.replace(regStr1, '(7)'); //tag替换成正常量
    exp = exp.replace(regStr, '+(9)'); //负常量替换成正常量

    var reg = /[\d\.\+\-\*\/\(\)]+/;
    try {
      return reg.test(exp) && !isNaN(eval("(" + exp + ")")) ? "" : I18N.Setting.Tag.InvalidFormula;
    } catch (e) {
      return I18N.Setting.Tag.InvalidFormula;
    }
  },
  _onRowClick: function(type, code) {
    var value = this.refs.fomula.getValue();
    var tagType;
    if (type === 1) {
      tagType = 'ptag';
    } else {
      tagType = 'vtag';
    }
    var newValue = value + '{' + tagType + '|' + code + '}';
    this.refs.fomula.setState({
      value: newValue,
      errorText: this.refs.fomula._getError(newValue)
    });
  },
  _renderFormula: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag;
    var fomulaProps = {
      ref: 'fomula',
      isViewStatus: isView,
      defaultValue: selectedTag.get('Formula'),
      isRequired: true,
      multiLine: true,
      regexFn: this.validateFormula,
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Formula"
        });
      }
    };
    return (<div className={"jazz-tag-formula-content-top"}>
    <div>{I18N.Setting.Tag.Formula}</div>
    <div className={"jazz-tag-formula-content-input"}>
      <ViewableTextField {...fomulaProps}/>
    </div>
  </div>);
  },
  _renderTable: function() {
    var table = null;
    if (this.props.selectedTag.get('Formula') === '') {
      table = <div>{I18N.Setting.Tag.FormulaText}</div>;
    } else if (!this.props.isViewStatus) {
      table = <MonitorTag tagId={this.props.selectedTag.get('Id')} onRowClick={this._onRowClick}/>;
    }
    return table;
  },

  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var formula = this._renderFormula();
    var table = this._renderTable();
    return (
      <div className={"jazz-tag-formula-content"}>
        {formula}
        {table}
      </div>
      );
  },
});

module.exports = TagFormula;
