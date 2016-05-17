import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker, RaisedButton, CircularProgress } from 'material-ui';
import assign from "object-assign";
import classNames from 'classnames';
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';

import SpecialItem from './SpecialItem.jsx';

var mergeDateTime = function(date, time) {
  var d = new Date(date);
  if (time)
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(time / 60), time % 60);
  else
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return d;
};

var datetimeTojson = function(date, time) {
  var d = mergeDateTime(date, time);
  return CommonFuns.DataConverter.DatetimeToJson(d);
};

var SpecialSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: true,
      tbsItem: null,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps) {
      this.setState({
        items: nextProps.items
      });
    }
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      isViewStatus: this.props.isViewStatus,
      tbsItem: null,
    };
  },

  _getFreshItems: function() {
    var items = this.getValue();
    return items;
  },

  _removeItem: function(src, index) {
    var oldItems = this._getFreshItems(),
      newItems = [];
    for (var i = 0; i < oldItems.length; i++) {
      if (i != index) {
        newItems.push(oldItems[i]);
      }
    }
    this.setState({
      items: newItems
    });
  },

  _addItem: function() {
    var arr = this.getValue(),
      newArr = [];
    var item = {
      Id: 0,
      TBSettingId: 0,
      StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1)),
    //StartTime: null,
    //EndTime: null,
    };
    newArr.push(item);
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[i]);
    }
    this.setState({
      items: newArr
    });
  },

  _onItemDateTimeChange: function(obj, index) {
    var tbsItem = this.state.tbsItem;
    if (tbsItem) {
      var val = this.getValue();
      if (val && obj)
        val[index] = obj;
      this._validate(tbsItem, val);
    }
  },

  validate: function(tbsItem) {
    this.setState({
      tbsItem: tbsItem
    });
    return this._validate(tbsItem);
  },

  _validate: function(tbsItem, val) {
    var valid = true,
      len = this.state.items.length;
    for (var i = 0; i < len; i++) {
      valid = valid && this.refs['item' + i].validate(tbsItem, val);
    }
    return valid;
  },

  // validateTBSettingItem: function(tbsItem){
  //   var valid = true, len = this.state.items.length;
  //   for (var i = 0; i < len; i++) {
  //     valid = valid & this.refs['item' + i].validate(tbsItem);
  //   }
  //   return valid;
  // },
  //
  // validateSpecialItem: function(specials){
  //   if(!specials) specials = this.getValue();
  //   var valid = true, len = this.state.items.length;
  //   for (var i = 0; i < len; i++) {
  //     valid = valid & this.refs['item' + i].validate(tbsItem);
  //   }
  //   return valid;
  // },

  getValue: function() {
    var arr = [],
      len = this.state.items.length;
    for (var i = 0; i < len; i++) {
      arr.push(this.refs['item' + i].getValue());
    }
    return arr;
  },

  render: function() {
    if (this.props.isViewStatus && this.props.items.length == 0) {
      return null;
    }
    var me = this,
      createItem = function(item, index) {
        var drvProps = {
          tag: me.props.tag,
          year: me.props.year,
          index: index,
          key: 'item' + index + 'random' + Math.random(),
          ref: 'item' + index,
          start: item.StartTime,
          end: item.EndTime,
          value: item.Value,
          isViewStatus: me.props.isViewStatus,
          onRemove: me._removeItem,
          onDateTimeChange: me._onItemDateTimeChange
        };
        return (<SpecialItem {...drvProps} />);
      };
    var style = {
      marginLeft: "20px",
    };
    var addBtnProps = {
      style: {
        padding: '0',
        minWidth: '20px',
        width: '30px',
        height: '20px',
        verticalAlign: 'middle',
        lineHeight: '20px'
      },
      labelStyle: {
        padding: '0'
      },
      label: "+",
      onClick: this._addItem
    };
    var addBtnCtrl;
    if (!this.props.isViewStatus) {
      addBtnCtrl = <FlatButton {...addBtnProps}/>;
    }

    return (<div style={style}>
        <div style={{
        marginTop: '18px'
      }}><span>{I18N.Setting.Calendar.AdditionalDay}</span>{addBtnCtrl}</div>
        <div style={{
        color: '#b3b3b3'
      }}>{this.state.items.map(createItem)}</div>
      </div>);
  }
});


module.exports = SpecialSetting;
