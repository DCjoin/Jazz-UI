import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker,RaisedButton,CircularProgress } from 'material-ui';
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

import DaytimeRangeValue from './DaytimeRangeValue.jsx';

var DaytimeRangeValues = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    items: React.PropTypes.array,
    isViewStatus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      items: this.props.items
    };
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps){
      this.setState({items: nextProps.items});
    }
  },

  getValue: function(){
    return this.state.items;
  },

  _onDaytimeRangeValueChange: function(e, index, newObj, preObj){
    var items = this.state.items, newItems=[];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(index > i){
        newItems.push(item);
        continue;
      }else if(index == i){
        item.EndTime = newObj.EndTime;
        newItems.push(item);
      }

      if(newObj.EndTime == 1440){
        break;
      }else{
        newItems.push({
          StartTime: newObj.EndTime,
          DayType: 0,
          EndTime: 1440
        });
        break;
      }
    }
    this.setState({items: newItems});
  },

  _onValueChange: function (e, index, newVal) {
    var items = this.state.items;
    items[index].Value = newVal;
  },

  render: function() {
    var me = this, idx = 0;
    var createItem = function(item){
      var props = {
        tag: me.props.tag,
        ref: 'item'+ idx,
        index: idx++,
        start: item.StartTime,
        end: item.EndTime,
        value: item.Value == undefined ? '': item.Value,
        isViewStatus: me.props.isViewStatus,
        onDaytimeChange: me._onDaytimeRangeValueChange,
        onValueChange: me._onValueChange
      };
      return (<DaytimeRangeValue {...props} />);
    }
    return <div>{this.state.items.map(createItem)}</div>;
  }
});


module.exports = DaytimeRangeValues;
