'use strict';

import React from 'react';
import HierarchyLogItem from './HierarchyLogItem.jsx';


let HierarchyLogList = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},
  render() {
    let me = this;
    let logList = this.props.logList;
    let logItems = null;
    if (logList && logList.size !== 0) {
      logItems = logList.map(function(item) {
        let props = {
          key: item.get('Id'),
          id: item.get('Id'),
          fileName: item.get('ImportFileName'),
          userName: item.get('ImportUserName'),
          time: item.get('ImportTime'),
          total: item.get('TotalCount'),
          failedNum: item.get('TotalFailedCount'),
          successNum: item.get('TotalSuccCount'),
          email: item.get('Email'),
          roleName: item.get('RoleName'),
          telephone: item.get('Telephone'),
        };
        return (
          <HierarchyLogItem {...props}/>
          );
      });
    }

    return (
      <div>
        {logItems}
      </div>
      );
  }
});

module.exports = HierarchyLogList;
