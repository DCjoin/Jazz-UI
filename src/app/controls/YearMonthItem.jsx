'use strict';

import React from 'react';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';
import moment from "moment";
import CommonFuns from '../util/Util.jsx';

var YearMonthItem = React.createClass({
  propTypes: {
    isViewStatus: React.PropTypes.bool,
    //date:"/Date(XX)/"
    date: React.PropTypes.string,
    onDateChange: React.PropTypes.func,
    errorMsg: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      date: new Date()
    };
  },
  _onDateChange: function(value, items, type) {
    var m = moment(this.props.date);
    var d2j = CommonFuns.DataConverter.DatetimeToJson;
    if (type === 'Year') {
      let year = parseInt(items[value - 1].text);
      m = m.set('year', year);
    } else {
      let month = value;
      m = m.set('month', month - 1);
    }
    this.props.onDateChange(d2j(new Date(m._d)));
  },
  _getYearItems: function() {
    var items = [];
    for (var thisYear = new Date().getFullYear(), i = 2006; i <= thisYear; i++) {
      items.push({
        payload: i - 2005,
        text: I18N.format(I18N.Setting.Cost.FormatYear, i)
      });
    }
    return items;
  },
  _getMonthItems: function() {
    var monthItems = [
      {
        payload: 1,
        text: I18N.Common.Date.January
      }, {
        payload: 2,
        text: I18N.Common.Date.February
      }, {
        payload: 3,
        text: I18N.Common.Date.March
      }, {
        payload: 4,
        text: I18N.Common.Date.April
      }, {
        payload: 5,
        text: I18N.Common.Date.May
      }, {
        payload: 6,
        text: I18N.Common.Date.June
      }, {
        payload: 7,
        text: I18N.Common.Date.July
      }, {
        payload: 8,
        text: I18N.Common.Date.August
      }, {
        payload: 9,
        text: I18N.Common.Date.September
      }, {
        payload: 10,
        text: I18N.Common.Date.October
      }, {
        payload: 11,
        text: I18N.Common.Date.November
      }, {
        payload: 12,
        text: I18N.Common.Date.December
      }];
    return monthItems;
  },
  componentWillReceiveProps: function() {
    console.log('componentWillReceiveProps');
  },
  componentDidMount: function() {
    console.log('componentDidMount');
  },
  render: function() {
    var m = moment(this.props.date),
      year = m.get('year') - 2005 || 0,
      month = m.get('month') + 1 || 0;
    var yearItems = this._getYearItems(),
      monthItems = this._getMonthItems();
    var monthProps = {
      ref: 'month',
      dataItems: monthItems,
      isViewStatus: this.props.isViewStatus,
      defaultValue: month,
      title: '',
      textField: 'text',
      style: {
        width: '100px'
      },
      didChanged: value => {
        this._onDateChange(value, monthItems, 'Month')
      }
    };
    var yearProps = {
      ref: 'year',
      dataItems: yearItems,
      isViewStatus: this.props.isViewStatus,
      defaultValue: year,
      title: '',
      textField: 'text',
      style: {
        width: '100px'
      },
      didChanged: value => {
        this._onDateChange(value, yearItems, 'Year')
      }
    };
    return (
      <div>
        <div className='jazz-fromenddate-item-text'>{I18N.Setting.Cost.EffectiveDate}</div>
          <div className="jazz-monthday-item">
            <div className='jazz-monthday-item-content'>
              <ViewableDropDownMenu {...yearProps}></ViewableDropDownMenu>
            </div>
            <div className='jazz-monthday-item-content'>
              <ViewableDropDownMenu {...monthProps}></ViewableDropDownMenu>
            </div>
          </div>
          <div className='jazz-carbon-addItem-errorText'>{this.props.errorMsg}</div>
      </div>

      );
  },
});
module.exports = YearMonthItem;
