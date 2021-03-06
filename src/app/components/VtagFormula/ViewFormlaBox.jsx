'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {TextField} from 'material-ui';
import _isString from 'lodash-es/isString';
import assign from 'object-assign';
import util from '../../util/Util.jsx';
import FormulaToolbar from "./FormulaToolbar.jsx";
import ContentEditable from "./React-contenteditable.jsx";

var _ = {
  isString: _isString
};
var createReactClass = require('create-react-class');
var ViewableTextField = createReactClass({

  propTypes: {
    isViewStatus: PropTypes.bool,
    regex: PropTypes.object,
    regexFn: PropTypes.func,
    maxLen: PropTypes.number,
    autoFocus: PropTypes.bool,
    isRequired: PropTypes.bool,
    didChanged: PropTypes.func,
    style: PropTypes.object,
    didBlur: PropTypes.func,
    multiLine: PropTypes.bool,
    didFocus: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.number.string]),
    errorMessage: PropTypes.string,
    errorText: PropTypes.string,
    hintText: PropTypes.string,
    title: PropTypes.string,
    afterValue: PropTypes.object,
  },

  contextTypes: {
    generatorBatchViewbaleTextFiled: PropTypes.func
  },
 

  getDefaultProps: function() {
    return {
      maxLen: 200
    };
  },
  // 系统默认
  getInitialState: function() {
    var v = null;
    //changed by wangyanhui 2016/1/25
    // if (_.isString(this.props.defaultValue) && this.props.defaultValue !== '') {
    //   v = this.props.defaultValue;
    // }
    v = this.props.defaultValue;
    return {
      errorText: "",
      value: ""
    };
  },

  componentWillMount: function() {
    if (this.context.generatorBatchViewbaleTextFiled) {
      this.context.generatorBatchViewbaleTextFiled(this);
    }
  },

  componentDidMount: function() {

    console.log('nihiaoafjsdfksjflkjflkjsldskfdslfsal',this);

    if (!this.props.isViewStatus && this.props.autoFocus) {
      var dom = ReactDOM.findDOMNode(this);
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
    var v = this.props.defaultValue;
    this.setState({
      value: v
    })
  },

  componentWillReceiveProps: function(nextProps, nextState) {
    if(this.props.isViewStatus !== nextProps.isViewStatus){
      this.setState({
        value:"",
      },()=>{
        this.setState({
          value: nextProps.defaultValue,
          errorText:this._getError(nextProps.defaultValue)
        });
      })
    }else {
      this.setState({
        value: nextProps.defaultValue,
        errorText:this._getError(nextProps.defaultValue)
      });
    }

    // if (nextProps.errorText != this.state.errorText) {
    //   this.setState({
    //     errorText: nextProps.errorText,
    //   });
    // }

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
        return I18N.Common.Label.MandatoryEmptyError;
      }
    } else {
      if (!value) {
        return '';
      }

    }

    if (this.props.maxLen && this.props.maxLen > 0 && value.length > this.props.maxLen) {
      return "超过最大长度" + this.props.maxLen;
    }

    if (this.props.regexFn) {
      return this.props.regexFn(value);
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
      var node = ReactDOM.findDOMNode(this.refs.TextField);
      node.className = '';
    }
  },
  getValue: function() {
    console.log('refs', this.refs.TextField);
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
    var node = ReactDOM.findDOMNode(this.refs.TextField);
    if(!node) return;
    node.className = 'pop-viewableTextField-focus';
    // if(this.props.height) node.style.height = this.props.height;
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
        errorStyle:{
          // marginTop:'10px'
        },
        errorText: !this.state.value ? this.state.errorText : this._getError(), //this.state.errorText,
        onChange: this._handleChange,
        onBlur: this._onBlur,
        onFocus: this._onFocus,
        style: assign({
          width: 430
        }, this.props.style),
        multiLine: this.props.multiLine ? true : false,
        // rows:this.state.value?this.state.value.split('\n').length:1,
        floatingLabelText: this.props.title,
        floatingLabelStyle:{fontSize:'12px',color:'#9fa0a4'},
        inputStyle:{fontSize:'14px',color:'#000000'},
        type: this.props.type
      };
      if(this.props.height){
        inputProps.style.height=this.props.height
      }
      if (this.props.hintText) {
        inputProps.hintText = this.props.hintText;
        inputProps.className = "pop-viewableTextField-hintmode";
        
      } else {
        inputProps.floatingLabelText = this.props.title;
        inputProps.className = "pop-viewableTextField-floatmode";
      }
      if (this.state.value !== undefined) {
        inputProps.value = this.state.value;
      } else {
        //inputProps.hintText = this.props.title;
      }
      if (inputProps.value !== undefined) {
        inputProps.className += " pop-viewableTextField-noempty";
      }
      // 编辑态样式
      textField = (
        <div style={{marginTop:'-8px'}}>
          {/* <TextField ref="TextField" {...inputProps} {...this.props}/> */}
          <ContentEditable
          // style={errorStyle}
          // ref="ContentEditable"
          // onBlur={(val) => this._onFormulaBlur(val)}
          // onChange={() => {}}
          // html={formulaHtml}
          />
          <FormulaToolbar />
        </div>
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
        maxWidth: 430
      }, this.props.style).width;
      // 默认显示查看态样式
      textField = (
        <div>

          {/* <div className="pop-viewable-title" style={{fontSize:'14px',color:'#9fa0a4',marginBottom:'8px'}}>
            {this.props.title}
          </div> */}

          <div className="pop-viewable-value" title={v} style={{fontSize:'14px',color:'#666666', overflow:'auto', backgroundColor:'#fbfbfb',border:'none' }}>
            {v}
            {afterValue}
          </div>
        </div>
      );
    }


    var style = {};
    if (this.props.isViewStatus && !this.props.defaultValue) {
      style.display = 'none';
    }
    style = assign({}, style, this.props.style);

    return (
      <div className="box-Wrapper">
        {textField}
      </div>
      );
  }
});

module.exports = ViewableTextField;
