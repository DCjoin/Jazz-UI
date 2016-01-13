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
    textField: React.PropTypes.string,
    didChanged: React.PropTypes.func,
    maxHeight: React.PropTypes.number,
    dataItems: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
  },

  getInitialState: function() {

    return {
      errorText: ""
    };
  },
  isValid: function() {
    var index = this.props.dataItems.findIndex((item) => {
      if (item.payload === this.props.defaultValue) {
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
    var payload = object.payload;
    this.props.didChanged(payload);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.isViewStatus == nextProps.isViewStatus &&
      CommonFuns.CompareArray(this.props.dataItems, nextProps.dataItems) &&
      this.props.selectedIndex == nextProps.selectedIndex &&
      this.props.defaultValue == nextProps.defaultValue) {
      return false;
    }

    return true;
  },

  render: function() {
    var dropDownMenu;
    var text = this.props.textField;
    if (this.props.dataItems === undefined) {
      return null;
    }
    var menuItems = this.props.dataItems.map((item, id) => {
      return {
        payload: item.payload,
        text: item[text],
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
        value = this.props.dataItems[this.props.selectedIndex][text];
      } else if (this.props.defaultValue !== undefined) {
        var index = this.props.dataItems.findIndex((item) => {
          if (item.payload === this.props.defaultValue) {
            return true;
          }
        });
        if (index !== -1) {
          value = this.props.dataItems[index][text];
        } else {
          value = null;
        }
      } else if (this.props.dataItems.length > 0) {
        value = this.props.dataItems[0][text];
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
