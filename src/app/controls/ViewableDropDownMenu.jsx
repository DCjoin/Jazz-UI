'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import {SelectField} from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import assign from 'object-assign';
import CommonFuns from '../util/Util.jsx';
import Immutable from 'immutable';
var createReactClass = require('create-react-class');
var ViewableDropDownMenu = createReactClass({
  propTypes: {
    isViewStatus: PropTypes.bool,
    selectedIndex: PropTypes.number,
    title: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.number.string]),
    afterValue: PropTypes.string,
    textField: PropTypes.string,
    valueField: PropTypes.string,
    didChanged: PropTypes.func,
    dataItems: PropTypes.array.isRequired,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    titleStyle:PropTypes.object,
  },
  getDefaultProps() {
    return {
      textField: 'text',
      valueField: 'payload',
      isViewStatus: false,
      disabled: false
    };
  },
  getInitialState: function() {
    return {
      errorText: this.props.initError ? this.props.errorText : ""
    };
  },
  isValid: function(props=this.props) {
    let dataItems=Immutable.fromJS(props.dataItems);
    var index = dataItems.findIndex((item) => {
      if (item.get(props.valueField) === props.defaultValue) {
        return true;
      }
    });
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  },

  _handleChange: function(e, index, value) {
    this.props.didChanged(value);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus === nextProps.isViewStatus &&
      CommonFuns.CompareArray(this.props.dataItems, nextProps.dataItems) &&
      this.props.selectedIndex === nextProps.selectedIndex &&
      this.props.defaultValue === nextProps.defaultValue &&
      this.props.disabled === nextProps.disabled) {
      return false;
    }

    return true;
  },

  componentWillReceiveProps(nextProps){
    var errorText='';
    if((!CommonFuns.CompareArray(this.props.dataItems, nextProps.dataItems) || this.props.defaultValue === nextProps.defaultValue)){
      if(nextProps.errorText){
        if(!this.isValid(nextProps)){
          errorText=this.props.errorText
        }
      }
    }
    this.setState({
      errorText
    })
  },

  render: function() {
    var dropDownMenu;
    var textField = this.props.textField;
    var valueField = this.props.valueField;
    if (this.props.dataItems === undefined) {
      return null;
    }
    var menuItems = this.props.dataItems.map((item, id) => {
      let label = item[textField];
      return(
          <MenuItem value={item[valueField]} label={label} disabled={(item.disabled !== undefined) ? item.disabled : false}>
            <div title={label} style={this.props.itemLabelStyle || {
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}>{label}</div>
          </MenuItem>
      )


    });

    if (!this.props.isViewStatus) {
      var inputPorps = {
        listStyle: {
          display: 'inline',
          width: 'auto',
        },
        errorText: this.state.errorText,
        onChange: this._handleChange,
        // style:{position:'absolute'},
        className: 'pop-viewableDropDownMenu-ddm',
        labelStyle:{marginRight:'30px',paddingRight:'0'},
        //selectedIndex: idx,
        style: assign({
          width: 430,
          marginTop: -9
        }, this.props.style)
      };
      if (this.props.selectedIndex >= 0) {
        inputPorps.value = this.props.dataItems[this.props.selectedIndex][valueField];
      }
      if (this.props.defaultValue !== undefined) {
        inputPorps.value = this.props.defaultValue;
      }
      dropDownMenu = (
        <div style={{
          position: 'relative'
        }}>
                    <div className="pop-viewable-title" style={this.props.titleStyle}>{this.props.title}</div>
                    <SelectField
         {...inputPorps} {...this.props}
        ref="DropDownMenu">{menuItems}</SelectField>
                </div>
      );
    } else {
      var afterValue = null;
      if (this.props.afterValue) {
        afterValue = this.props.afterValue;
      }
      var value = '';
      if (this.props.selectedIndex >= 0) {
        value = this.props.dataItems[this.props.selectedIndex][textField];
      } else if (this.props.defaultValue !== undefined) {
        var dataItems=Immutable.fromJS(this.props.dataItems);
        var index = dataItems.findIndex((item) => {
          if (item.get(this.props.valueField) === this.props.defaultValue) {
            return true;
          }
        });
        if (index !== -1) {
          value = this.props.dataItems[index][textField];
        } else {
          value = null;
        }
      } else if (this.props.dataItems.length > 0) {
        value = this.props.dataItems[0][textField];
      }

      dropDownMenu = (
        <div>
                    <div className="pop-viewable-title">{this.props.title}</div>
                    <div className="pop-viewable-value">{value}{afterValue}</div>
                </div>
      );
    }
    return (
      <div className="pop-viewableDropDownMenu  pop-viewableTextField">
                {dropDownMenu}
            </div>
      );
  }
});

module.exports = ViewableDropDownMenu;
