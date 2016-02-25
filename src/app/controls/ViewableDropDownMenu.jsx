'use strict';

import React from 'react';
import mui from 'material-ui';

let {SelectField} = mui;
import assign from 'object-assign';
import CommonFuns from '../util/Util.jsx';
var ViewableDropDownMenu = React.createClass({
  propTypes: {
    isViewStatus: React.PropTypes.bool,
    selectedIndex: React.PropTypes.number,
    title: React.PropTypes.string,
    defaultValue: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    afterValue: React.PropTypes.string,
    textField: React.PropTypes.string,
    valueField: React.PropTypes.string,
    didChanged: React.PropTypes.func,
    dataItems: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
    disabled: React.PropTypes.bool,
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
      errorText: ""
    };
  },
  isValid: function() {
    var index = this.props.dataItems.findIndex((item) => {
      if (item[this.props.valueField] === this.props.defaultValue) {
        return true;
      }
    });
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  },

  _handleChange: function(e, index, object) {
    var value = object[this.props.valueField];
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

  render: function() {
    var dropDownMenu;
    var textField = this.props.textField;
    var valueField = this.props.valueField;
    if (this.props.dataItems === undefined) {
      return null;
    }
    var menuItems = this.props.dataItems.map((item, id) => {
      return {
        payload: item[valueField],
        text: item[textField],
        disabled: (item.disabled !== undefined) ? item.disabled : false
      };
    });

    if (!this.props.isViewStatus) {
      var inputPorps = {
        errorText: this.state.errorText,
        onChange: this._handleChange,
        menuItems: menuItems,
        // style:{position:'absolute'},
        className: 'pop-viewableDropDownMenu-ddm',
        //selectedIndex: idx,
        style: assign({
          width: 430,
          marginTop: -9
        }, this.props.style)
      };
      if (this.props.selectedIndex >= 0) {
        inputPorps.selectedIndex = this.props.selectedIndex;
      }
      if (this.props.defaultValue !== undefined) {
        inputPorps.value = this.props.defaultValue;
      }
      dropDownMenu = (
        <div style={{
          position: 'relative'
        }}>
                    <div className="pop-viewable-title">{this.props.title}</div>
                    <SelectField
        {...this.props} {...inputPorps}
        ref="DropDownMenu"/>
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
        var index = this.props.dataItems.findIndex((item) => {
          if (item[this.props.valueField] === this.props.defaultValue) {
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
