'use strict';

import React from 'react';
import { Mixins, Styles, ClearFix, FlatButton } from 'material-ui';
import ItemButton from '../controls/ItemButton.jsx';

var CalendarMonth = React.createClass({
  propTypes: {
    selectedMonth: React.PropTypes.number.isRequired,
    onMonthChange: React.PropTypes.func
  },

  render() {
    let styles = {
      lineHeight: '32px',
      textAlign: 'center',
      padding: '8px 14px 0 14px',
    };

    return (
      <div style={styles}>
        {this._getMonthItems()}
      </div>
      );
  },
  _getMonthItems() {
    let monthArray = [
      [{
        text: I18N.Common.Glossary.MonthName.January,
        value: 1
      }, {
        text: I18N.Common.Glossary.MonthName.February,
        value: 2
      }],
      [{
        text: I18N.Common.Glossary.MonthName.March,
        value: 3
      }, {
        text: I18N.Common.Glossary.MonthName.April,
        value: 4
      }],
      [{
        text: I18N.Common.Glossary.MonthName.May,
        value: 5
      }, {
        text: I18N.Common.Glossary.MonthName.June,
        value: 6
      }],
      [{
        text: I18N.Common.Glossary.MonthName.July,
        value: 7
      }, {
        text: I18N.Common.Glossary.MonthName.August,
        value: 8
      }],
      [{
        text: I18N.Common.Glossary.MonthName.September,
        value: 9
      }, {
        text: I18N.Common.Glossary.MonthName.October,
        value: 10
      }],
      [{
        text: I18N.Common.Glossary.MonthName.November,
        value: 11
      }, {
        text: I18N.Common.Glossary.MonthName.December,
        value: 12
      }]
    ];

    return monthArray.map((monthItem, i) => {
      return (
        <ClearFix key={i}>
          {this._getMonthElements(monthItem, i)}
        </ClearFix>
        );
    }, this);
  },

  _getMonthElements(monthItem, i) {

    return monthItem.map((month, j) => {
      return (
        <ItemButton
        height={32}
        key={'month' + i + j}
        ref={'month' + month.value}
        item={month}
        selected={this.props.selectedMonth === month.value}
        onTouchTap={this._onMonthTouchTap}/>
        );
    }, this);
  },

  _onMonthTouchTap(e, month) {
    if (this.props.onMonthChange) this.props.onMonthChange(e, month);
  }
});


module.exports = CalendarMonth;
