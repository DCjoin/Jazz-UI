'use strict';

import React from "react";
import FromEndTime from '../../controls/FromEndTime.jsx';

var FromEndTimeGroup = React.createClass({
  getInitialState: function() {
    var length = this.props.items.size;
    var errorTextArr = [];
    for (var i = 0; i < length; i++) {
      errorTextArr.push('');
    }
    return {
      errorTextArr: errorTextArr
    };
  },
  render() {
    let me = this;
    let items = this.props.items;
    let workTimeItems = null;
    if (items && items.size !== 0) {
      workTimeItems = items.map(function(item, i) {
        let props = {
          index: i,
          isViewStatus: me.props.isViewStatus,
          hasDeleteButton: i === (items.size - 1) ? false : true,
          errorText: me.state.errorTextArr[i],
          startTime: item.get('StartFirstPart') * 60 + item.get('StartSecondPart'),
          endTime: item.get('EndFirstPart') * 60 + item.get('EndSecondPart'),
          id: item.get('Id'),
          type: item.get('Type')
        };
        return (
          <FromEndTime {...props}></FromEndTime>
          );
      });
    }
    return (
      <div>
        {workTimeItems}
      </div>
      );
  }
});
module.exports = FromEndTimeGroup;
