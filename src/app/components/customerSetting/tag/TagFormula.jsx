'use strict';

import React from "react";
import PropTypes from 'prop-types';
/* 6.40以前版本的上拉填充
 import ViewableTextField from '../../../controls/ViewableTextField.jsx';*/
import MonitorTag from './MonitorTag.jsx';
// 加入算符框
import FormulaBox from '../../VtagFormula/FormulaBox.jsx'
import ViewFormlaBox from '../../VtagFormula/ViewFormlaBox.jsx'
var createReactClass = require('create-react-class');
var TagFormula = createReactClass({
  propTypes: {
    selectedTag: PropTypes.object,
    mergeTag: PropTypes.func,
    isViewStatus: PropTypes.bool
  },
  // 点击编辑 添加到填充框中的样式和事件
  _onRowClick: function(type, code) {
    var value = this.refs.formula.getValue();
    var tagType;
    if (type === 1) {
      tagType = 'ptag';
    } else {
      tagType = 'vtag';
    }
    var newValue = value + '{' + tagType + '|' + code + '}';
    this.refs.formula.setState({
      value: newValue,
      errorText: this.refs.formula._getError(newValue)
    }, () => {
      this.props.mergeTag({
        value: newValue,
        path: "Formula"
      });
    });
  },
  // 输入框，算符框 查看态和编辑态的判断
  _renderFormula: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag;
    var fomulaProps = {
      ref: 'formula',
      isViewStatus: isView,
      defaultValue: selectedTag.get('Formula'),
      isRequired: true,
      multiLine: true,
      maxLen: -1,
      // 正则替换
      regexFn: this.validateFormula,
      hintText: I18N.Setting.Tag.FormulaEditText,
      didChanged: value => {
        me.props.mergeTag({
          value,
          path: "Formula"
        });
      }
    };
    var formular;
    if (this.props.selectedTag.get('Formula') === '' && this.props.isViewStatus) {
      formular = null;
    } else {
      // 计算公式上拉的样式
      formular = (<div className={"jazz-tag-formula-content-top"}>
      <div style={{
        fontSize: '14px',
        color: '#abafae'
      }}>
      {/* 计算公式 */}
        {I18N.Setting.Tag.Formula}
      </div>
      {/* 填充内容 */}
      <div className={"jazz-tag-formula-content-top-input"} style={{
        margintop:'6px'
        }}>
        {/* 计算属性 * 6.40版本前的
          <ViewableTextField {...fomulaProps}/> /}
         {/* 计算公式的位置(算符，填充框) */}
         <ViewFormlaBox {...fomulaProps} /> 
         
      </div>
    </div>);
    }
    return formular;
  },

  // 编辑按钮事件
  _renderTable: function() {
    var table = null;
    if (this.props.selectedTag.get('Formula') === '' && this.props.isViewStatus) {
      table = <div style={{
        fontSize: '14px'
      }}>{I18N.Setting.Tag.FormulaText}</div>;
    } else if (!this.props.isViewStatus) {
      table = <MonitorTag tagId={this.props.selectedTag.get('Id')} onRowClick={this._onRowClick}/>;
    }
    return table;
  },
  validateFormula: function(exp) {
    var regStr = /(-\d+)(\.\d+)?/g; //匹配负浮点数
    var regStr1 = /\{[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\!\@\$\<\>\'\"\*\#\&\,\:\;\.\~\+\%\\\/\|]*\}/g;
    var regStr2 = /-\{[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\!\@\$\<\>\'\"\*\#\&\,\:\;\.\~\+\%\\\/\|]*\}/g;
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
