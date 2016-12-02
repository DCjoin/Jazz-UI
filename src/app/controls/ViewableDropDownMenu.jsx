'use strict';

import React from 'react';
import {SelectField} from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import assign from 'object-assign';
import CommonFuns from '../util/Util.jsx';
import Immutable from 'immutable';
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
    let dataItems=Immutable.fromJS(this.props.dataItems);
    var index = dataItems.findIndex((item) => {
      if (item.get(this.props.valueField) === this.props.defaultValue) {
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

  render: function() {
    var dropDownMenu;
    var textField = this.props.textField;
    var valueField = this.props.valueField;
    if (this.props.dataItems === undefined) {
      return null;
    }
    var menuItems = this.props.dataItems.map((item, id) => {
      return(
          <MenuItem value={item[valueField]} primaryText={item[textField]} disabled={(item.disabled !== undefined) ? item.disabled : false}/>
      )


    });

    if (!this.props.isViewStatus) {
      var inputPorps = {
        errorText: this.state.errorText,
        onChange: this._handleChange,
        // style:{position:'absolute'},
        className: 'pop-viewableDropDownMenu-ddm',
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
                    <div className="pop-viewable-title">{this.props.title}</div>
                    <SelectField
        {...this.props} {...inputPorps}
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
