var React = require('react');
import ReactDom from 'react-dom';
import {TextField} from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
import Util from '../util/Util.jsx';
import numeral from 'numeral';

var ViewableNumberField = React.createClass({
  propTypes: {
    isViewStatus: React.PropTypes.bool,
    title: React.PropTypes.string,
    style: React.PropTypes.object,
    validate: React.PropTypes.func,
    didChanged: React.PropTypes.func,
    defaultValue: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    format: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]), //function or format string(http://numeraljs.com/)
    unit: React.PropTypes.string
  },

  _focus: false,

  getDefaultProps: function() {
    return {
      // format: function(value) {
      //   if (parseInt(value) === value) {
      //     value = numeral(value).format('0,0');
      //     return value;
      //   }
      //   value = numeral(value).format('0,0.00');
      //   return value;
      // },
      unit: ''
    };
  },

  getInitialState: function() {
    return {
      errorText: ""
    };
  },

  _onBlur() {
    if (Util.isEmptyStr(this.props.defaultValue, false)) {
      var node = ReactDom.findDOMNode(this.refs.tf);
      node.className = '';
    }
    this._focus = false;
  },

  _onFocus() {
    var node = ReactDom.findDOMNode(this.refs.tf);
    node.className = 'pop-viewableTextField-focus';
    this._focus = true;
  },

  _handleChange(event) {
    var value = event.target.value;
    if (this.props.didChanged) {
      this.props.didChanged(value);
    }
  },

  isValid(value = this.props.defaultValue) {
    if (!this.props.validate && value != null && value !== "" && !/^(\+|\-)?[0-9]+(.[0-9]+)?$/.test(value)) {
      return {
        valid: false,
        text: I18N.Common.Control.ViewableNumberField.Error
      };
    }

    if (this.props.validate) {
      var error = this.props.validate(value);
      if (error && typeof error === 'string') {
        return {
          valid: false,
          text: error
        };
      }
    }
    return {
      valid: true
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      value: nextProps.defaultValue
    }) ;
  },

  render: function() {
    var textField = null;
    var hideOnView = null;
    if (this.props.isViewStatus) { //view mode
      var value = this.props.defaultValue;
      if (!Util.isEmptyStr(value) && this.props.format) {
        if (typeof this.props.format === 'string') {
          value = numeral(value).format(this.props.format);
        } else if (typeof this.props.format === 'function') {
          value = this.props.format(value);
        }
      }
      hideOnView = Util.isEmptyStr(value);
      textField = (
        <div>
              <div className="pop-viewable-title">{this.props.title}</div>
              <div className="pop-viewable-value">{value}{this.props.unit}</div>
          </div>
      );
    } else { //edit mode
      var validRet = this.isValid(this.props.defaultValue);
      var errorText = '';
      if (!validRet.valid) {
        errorText = validRet.text;
      }
      var className = classNames({
        "pop-viewableTextField-noempty": !Util.isEmptyStr(this.props.defaultValue),
        "pop-viewableTextField-focus": !Util.isEmptyStr(this.props.defaultValue) || this._focus
      });
      var inputProps = {
        errorStyle:{
          marginTop:'10px'
        },
        floatingLabelText: this.props.title,
        onBlur: this._onBlur,
        onFocus: this._onFocus,
        onChange: this._handleChange,
        errorText,
        style: assign({
          width: 430
        }, this.props.style),
        value: this.props.defaultValue,
        className
      };
      var textField = <TextField ref='tf' {...inputProps} ></TextField>;
    }

    var style = {};
    if (hideOnView) {
      style.display = 'none';
    }
    return (
      <div className='pop-viewableTextField' style={style}>
           {textField}
      </div>
      );
  }

});

module.exports = ViewableNumberField;
