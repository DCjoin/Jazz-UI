'use strict';

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter } from 'material-ui';
import Item from '../../controls/SelectableItem.jsx';
import SelectablePanel from '../../controls/SelectablePanel.jsx';


var Test = React.createClass({

  render: function() {
    let items = [];
    for (var i = 0; i < 10; i++) {
      items.push(<Item index={i}
      label='rwqtewt'
      text={'gfdagadg' + ' ' + '2016/01/04'}
      selectedIndex={0}/>)
    }

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
      <SelectablePanel addBtnLabel='用户'
      filterBtnLabel='筛选'
      isViewStatus={true}
      isLoading={false}
      sortItems={[
        {
          type: 'customername@asc',
          label: I18N.Platform.ServiceProvider.CustomerName
        },
        {
          type: 'starttime@desc',
          label: I18N.Platform.ServiceProvider.StartTime
        },
      ]}
      sortBy={'customername@asc'}
      contentItems={items}/>
    </div>
      )
  }
});

module.exports = Test;
