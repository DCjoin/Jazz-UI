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
    let tagLogList = this.props.tagLogList;
    let tagLogItems = null;
    if (tagLogList && tagLogList.size !== 0) {
      tagLogItems = tagLogList.map(function(item) {
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
        {tagLogItems}
      </div>
      );
  }
});

module.exports = HierarchyLogList;
