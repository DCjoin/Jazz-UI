'use strict';

import React from 'react';
import mui from 'material-ui';
import _isString from 'lodash/lang/isString';
import assign from 'object-assign';
import util from '../util/Util.jsx';
let {TextField} = mui;
var _ = {
  isString: _isString
};

var ViewableTextField = React.createClass({

  propTypes: {
    isViewStatus: React.PropTypes.bool,
    regex: React.PropTypes.object,
    maxLen: React.PropTypes.number,
    autoFocus: React.PropTypes.bool,
    isRequired: React.PropTypes.bool,
    didChanged: React.PropTypes.func,
    style: React.PropTypes.object,
    didBlur: React.PropTypes.func,
    multiLine: React.PropTypes.bool,
    didFocus: React.PropTypes.func,
    defaultValue: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    errorText: React.PropTypes.string,
    hintText: React.PropTypes.string,
    title: React.PropTypes.string,
    afterValue: React.PropTypes.object,
  },

  contextTypes: {
    generatorBatchViewbaleTextFiled: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      maxLen: 200
    };
  },

  getInitialState: function() {
    var v = null;
    if (_.isString(this.props.defaultValue) && this.props.defaultValue !== '') {
      v = this.props.defaultValue;
    }
    return {
      errorText: "",
      value: v
    };
  },

  componentWillMount: function() {
    if (this.context.generatorBatchViewbaleTextFiled) {
      this.context.generatorBatchViewbaleTextFiled(this);
    }
  },

  componentDidMount: function() {
    if (!this.props.isViewStatus && this.props.autoFocus) {
      var dom = React.findDOMNode(this);
      var text = null;
      if (this.props.multiLine) {
        text = dom.querySelectorAll('textarea')[1];
      // text.style.maxHeight='400px';
      // text.style.overflow='auto';
      } else {
        text = dom.querySelectorAll('input')[0];
      }
      text.focus();
      text.setSelectionRange(text.value.length, text.value.length);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      value: nextProps.defaultValue,
    });
    if (!!nextProps.errorText) {
      this.setState({
        errorText: nextProps.errorText,
      });
    }

  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus && this.props.errorText === nextProps.errorText && this.state.defaultValue === nextProps.defaultValue && this.state.value === nextState.value) {
      return false;
    }
    return true;

  },

  _getError: function(value = this.state.value) {
    if (this.props.isRequired) {
      if (util.isEmptyStr(value)) {
        return '不能为空';
      }
    } else {
      if (!value) {
        return '';
      }

    }

    if (this.props.maxLen && this.props.maxLen > 0 && value.length > this.props.maxLen) {
      return "超过最大长度" + this.props.maxLen;
    }

    if (this.props.regex != null && this.props.regex.test(value)) {
      return "";
    } else {
      return this.props.errorMessage;
    }
  },

  clearErrorText: function() {
    this.setState({
      errorText: ""
    });
  },

  clearValue() {
    if (this.refs.TextField) {
      this.refs.TextField.clearValue();
    }
  },
  // Need remove
  _settleDownValue(value, error) {
    this.setState({
      value: value,
      errorText: error
    }, function() {
      if (this.props.didChanged) {
        this.props.didChanged(this.state.value);
      }
    });
  },
  _handleChange: function(event) {
    this.setState({
      value: event.target.value,
      errorText: this._getError(event.target.value)
    }, function() {
      if (this.props.didChanged) {
        this.props.didChanged(this.state.value);
      }
    });
  /*var value = event.target.value;
              if(this.props.isRequired){
                  if(!value){
                      this._settleDownValue(value,'不能为空');
                      return;
                  }
              }
              else{
                  if(!value){
                      this._settleDownValue(value,'');
                      return ;
                  }

              }

              if(this.props.maxLen && value.length>this.props.maxLen){
                  this._settleDownValue(value,"超过最大长度"+this.props.maxLen);
                  return;
              }
              else{
                  if(this.props.regex!=null && this.props.regex.test(value)){
                      this._settleDownValue(value,"");
                      return ;

                  } else {
                      this._settleDownValue(value,this.props.errorMessage);
                      return;
                  }
              }*/
  },
  _onBlur() {
    if (this.props.didBlur) {
      this.props.didBlur(this.state.value);
    }
    if (!this.state.value) {
      var node = this.refs.TextField.getDOMNode();
      node.className = '';
    }
  },
  getValue: function() {
    return this.refs.TextField.getValue();
  },
  isValid(value) {
    if (this._getError(value)) {
      return false;
    }
    return true;
  },
  focus: function() {
    if (this.refs.TextField) {
      this.refs.TextField.focus();
    }
  },
  _onFocus() {
    var node = this.refs.TextField.getDOMNode();
    node.className = 'pop-viewableTextField-focus';
    if (this.props.didFocus) {
      this.props.didFocus();
    }
  },
  render: function() {
    var textField = null;
    var inputProps = null;
    var afterValue = null;

    if (this.props.afterValue) {
      afterValue = this.props.afterValue;
    }

    if (!this.props.isViewStatus) {
      inputProps = {
        errorText: this.state.errorText, //this._getError(),
        onChange: this._handleChange,
        onBlur: this._onBlur,
        onFocus: this._onFocus,
        style: assign({
          width: 430
        }, this.props.style),
        multiLine: this.props.multiLine
          ? true
          : false,
        floatingLabelText: this.props.title
      };
      if (this.props.hintText) {
        inputProps.hintText = this.props.hintText;
        inputProps.className = "pop-viewableTextField-hintmode";
      } else {
        inputProps.floatingLabelText = this.props.title;
        inputProps.className = "pop-viewableTextField-floatmode";
      }
      if (this.state.value) {
        inputProps.value = this.state.value;
      } else {
        //inputProps.hintText = this.props.title;
      }
      if (inputProps.value) {
        inputProps.className += " pop-viewableTextField-noempty";
      }
      textField = (
        <div><TextField ref="TextField" {...inputProps}/></div>
      );
    } else {
      var v = this.props.defaultValue;
      if (this.props.multiLine) {
        var arr = v.split('\n');
        if (arr.length > 1) {
          v = arr.map(item => {
            return <div>{item}</div>;
          });
        }
      }
      var width = assign({
        width: 430
      }, this.props.style).width;
      textField = (
        <div style={{
          'width': width
        }} >
          <div className="pop-viewable-title">{this.props.title}</div>
          <div className="pop-viewable-value">{v}
            {afterValue}</div>
        </div>
      );
    }


    var style = {};
    if (this.props.isViewStatus && !this.props.defaultValue) {
      style.display = 'none';
    }
    style = assign({}, style, this.props.style);

    return (
      <div className="pop-viewableTextField" style={style}>
        {textField}
      </div>
      );
  }
});

module.exports = ViewableTextField;
