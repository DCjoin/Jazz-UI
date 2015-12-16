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
import TBSettingItem from './TBSettingItem.jsx';

var mergeDateTime = function(date, time) {
  var d = new Date(date);
  if (time)
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(time / 60), time % 60);
  else
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return d;
}

var datetimeTojson = function(date, time) {
  var d = mergeDateTime(date, time);
  return CommonFuns.DataConverter.DatetimeToJson(d);
};
var TBSettingItems = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool,
    dateRange: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: false,
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || []
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps) {
      this.setState({
        items: nextProps.items,
      });
    }
  },

  tryGetValue: function() {
    var val = this.getValue(),
      len = this.state.items.length,
      valid = true;
    for (var i = 0; i < len; i++) {
      valid = valid && this.refs['item' + i].validate(val);
    }
    return [valid, val];
  },

  getValue: function() {
    var arr = [],
      len = this.state.items.length;
    for (var i = 0; i < len; i++) {
      arr.push(this.refs['item' + i].getValue());
    }
    return arr;
  },

  setValue: function(items) {
    this.setState({
      items: items
    });
  },

  _setSetting: function(nextProps) {
    var items = [];
    if (nextProps) {
      items = nextProps.items;
    }
    this.setState({
      items: items
    });
  },

  _getFreshItems: function() {
    var items = this.getValue();
    return items;
  },

  _removeSetting: function(src, index) {
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

  _onSettingItemDateChange: function(childVal, idx) {
    var valid = true,
      vals = this.getValue();
    if (vals && vals[idx]) {
      vals[idx] = childVal;
    }
    for (var i = 0; i < vals.length; i++) {
      valid = valid && this.refs['item' + i].validate(vals);
    }
  },

  _addSetting: function() {
    var arr = this.getValue(),
      newArr = [];
    var item = {
      TbSetting: {
        StartTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year, 0, 1)),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(new Date(this.props.year + 1, 0, 1)),
      //StartTime: null,
      //EndTime: null
      },
      NormalDates: [],
      SpecialDates: [],
      TbAvgDtos: []
    };
    newArr.push(item);
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[i]);
    }
    this.setState({
      items: newArr
    });
  },

  render: function() {
    var me = this,
      cyear = this.props.year;

    var createItem = function(item, index) {
      var drvProps = {
        tag: me.props.tag,
        index: index,
        ref: 'item' + index,
        year: cyear,

        normals: item.NormalDates,
        specials: item.SpecialDates,
        avgs: item.TbAvgDtos,

        isViewStatus: me.props.isViewStatus,
        onRemove: me._removeSetting,
        onSettingItemDateChange: me._onSettingItemDateChange,
        dateRange: me.props.dateRange,
      };

      if (item.TbSetting && item.TbSetting.StartTime) {
        drvProps.start = item.TbSetting.StartTime;
      }
      if (item.TbSetting && item.TbSetting.EndTime) {
        drvProps.end = item.TbSetting.EndTime;
      }
      return (<TBSettingItem {...drvProps} />);
    };

    var addBtnCtrl,
      title = <span>时段设置</span>;
    if (this.props.isViewStatus) {
      if (this.props.items.length == 0)
        title = null;
    } else {
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
        onClick: this._addSetting,
        disabled: this.props.isViewStatus,
      };
      addBtnCtrl = <FlatButton {...addBtnProps} />
    }
    return (<div style={{
        marginTop: '15px'
      }}>
        <div>{title}{addBtnCtrl}</div>
        <div>{this.state.items.map(createItem)}</div>
      </div>);
  }
});


module.exports = TBSettingItems;
