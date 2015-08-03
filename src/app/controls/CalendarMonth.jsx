'use strict';

import React from 'react';
import {Mixins,Styles,ClearFix,FlatButton} from 'material-ui';
import MonthButton from '../controls/MonthButton.jsx';

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
     [{text:"一月", value:"1"}, {text:"二月", value:"2"}],
     [{text:"三月", value:"3"}, {text:"四月", value:"4"}],
     [{text:"五月", value:"5"}, {text:"六月", value:"6"}],
     [{text:"七月", value:"7"}, {text:"八月", value:"8"}],
     [{text:"九月", value:"9"}, {text:"十月", value:"10"}],
     [{text:"十一月", value:"11"}, {text:"十二月", value:"12"}]
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
        <MonthButton
          key={'month' + i + j}
          ref={'month'+ (i * 2 + j + 1)}
          month={month}
          selected={this.props.selectedMonth === (i * 2 + j + 1)}
          onTouchTap={this._onMonthTouchTap}/>
      );
    }, this);
  },

  _onMonthTouchTap(e, month) {
    if (this.props.onMonthChange) this.props.onMonthChange(e, month);
  }
});


module.exports = CalendarMonth;
