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
import CalcItem from './CalcItem.jsx';

var CalcSetting = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    items: React.PropTypes.array,
    onCalc: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool,
    isDisplay: React.PropTypes.bool,
    dateRange: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      items: []
    };
  },

  getValue: function() {
    var arr = [];
    if (!this.refs['item1']) {
      return arr;
    }
    for (var i = 1; i < 25; i++) {
      var val = this.refs['item' + i].getValue();
      val.TBTime = i;
      arr.push(val);
    }
    return arr;
  },

  validate: function() {
    var startDate = new Date(this.props.dateRange.start),
      endDate = new Date(this.props.dateRange.end),
      tmpDate = new Date(startDate);
    tmpDate.setMonth(tmpDate.getMonth() + 1);
    return tmpDate >= endDate;
  },

  _onCalcClick: function() {
    if (this.props.onCalc) {
      this.props.onCalc();
    }
  },

  render: function() {
    if (!this.props.isDisplay) {
      return <div></div>;
    }
    if (!this.validate() && !this.props.isViewStatus) {
      return <div style={{
          color: 'red',
          fontSize: 12
        }}>所选数据的时间跨度大于一个月，无法计算，请重新选择数据</div>;
    }
    var items = this.props.items || [],
      rows = [];
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    var me = this;
    var createItem = function(item, index) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].TBTime == item) {
            var props = {
              tag: me.props.tag,
              ref: 'item' + item,
              time: item,
              val1: items[i].WorkDayValue,
              val2: items[i].HolidayDayValue,
              val1Mod: items[i].WorkDayValueStatus,
              val2Mod: items[i].HolidayValueStatus,
              isViewStatus: me.props.isViewStatus,
            };
            return <CalcItem {...props} />;
          }
        }
        var props = {
          tag: me.props.tag,
          ref: 'item' + item,
          time: item,
          isViewStatus: me.props.isViewStatus,
          val1: '',
          val2: '',
          val1Mod: false,
          val2Mod: false,
        };
        return <CalcItem {...props} />;
      },
      rows = arr.map(createItem);
    var style = {
      margin: "18px 0",
      padding: '9px',
      border: "1px solid #efefef",
    };

    var reCalcCtrl;
    if (!this.props.isViewStatus) {
      reCalcCtrl = <a href="javascript:void(0)" onClick={this._onCalcClick}  style={{
        color: '#1ca8dd',
        'margin-left': '27px'
      }}>重新计算</a>;
    }

    return (
      <div>
        <div className="jazz-setting-basic-calcsetting">
          <table >
            <tr>
              <td>时间</td>
              <td>工作日</td>
              <td>非工作日</td>
            </tr>
            {rows}
          </table>
        </div>
        {reCalcCtrl}
      </div>
      );
  }
});


module.exports = CalcSetting;
