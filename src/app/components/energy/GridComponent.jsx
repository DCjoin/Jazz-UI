'use strict';
import React from "react";
import {Table} from 'material-ui';

let GridComponent = React.createClass({

  propTypes:{
    energyData: React.PropTypes.object,
    energyRawData: React.PropTypes.object,
  },
  getInitialState(){
    return {
      fixedHeader: true,
      stripedRows: true,
      showRowHover: true,
      displayRowCheckbox: false,
      displaySelectAll:false,
      // selectable: false,
      // multiSelectable: false,
      // canSelectAll: false,
      //deselectOnClickaway: true,
      height: '500px'
    };
  },
  getFormatEnergyData(energyData){
    let dataArray = energyData;
    let firstItems = dataArray[0].items;
    let gridData = [], row;
    for(let i = 0,len=firstItems.length; i<len;i++){
      row = {};
      row.localTime = {content:firstItems[i].localTime};
      for(let k = 0; k<dataArray.length;k++){
        row[dataArray[k].TargetId + ''] = {content:dataArray[k].items[i].value};
      }
      gridData.push(row);
    }
    return gridData;
  },
  getHeaderCols(energyData){
    let dataArray = energyData;

    let headerCols = {
      localTime: {
        content: '时间'
      }
    };
    for(let i=0;i<dataArray.length;i++){
      headerCols[dataArray[i].TargetId + ''] ={content:dataArray[i].Name};
    }
    return headerCols;
  },
  getColOrder(energyData){
      let dataArray = energyData;
      let colOrder = ['localTime'];
      for(let i=0;i<dataArray.length;i++){
        colOrder.push(dataArray[i].TargetId + '');
      }
      return colOrder;
  },
  render(){
    let energyData = this.props.energyData.toJS();
    let rowData = this.getFormatEnergyData(energyData);
    let headerCols = this.getHeaderCols(energyData);
    let colOrder = this.getColOrder(energyData);
    //let header = <div><div>column1</div><div>column1</div><div>column1</div></div>;
    // Table component
    return <div className='jazz-energy-gridcomponent-wrap'><Table
        headerColumns={headerCols}
        columnOrder={colOrder}
        rowData={rowData}

        fixedHeader={this.state.fixedHeader}
        stripedRows={this.state.stripedRows}
        showRowHover={this.state.showRowHover}
        selectable={this.state.selectable}
        displayRowCheckbox = {this.state.displayRowCheckbox}
        displaySelectAll = {this.state.displaySelectAll}

        />
    </div>;
  }
});
module.exports = GridComponent;
