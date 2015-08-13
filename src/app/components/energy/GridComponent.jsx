'use strict';
import React from "react";
import {Table} from 'material-ui';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import {getUomById} from '../../util/Util.jsx';

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
        content: <div style={{marginLeft:'10px'}}>{'时间'}</div>
      }
    };
    for(let i=0;i<dataArray.length;i++){
      var tagOption = this.getTagInfo(dataArray[i].TargetId);
      headerCols[dataArray[i].TargetId + ''] =this.getTagColumnContent(tagOption.hieName, tagOption.tagName, tagOption.uom);//{content: dataArray[i].Name};
    }
    return headerCols;
  },
  getTagInfo(tagId){
    var tagOptions = EnergyStore.getTagOpions(),
        option;

    for(let i=0; i<tagOptions.length;i++){
      option = tagOptions[i];
      if(option.tagId === tagId){
        var hieName = option.hierName.split('\\');
        hieName = hieName[hieName.length-1];
        var uom = getUomById(option.uomId);
        var uomName = uom.Code;
        return { hieName:hieName, tagName:option.tagName, uom: uomName};
      }
    }
  },
  getTagColumnContent(hieName, tagName, uom){
    var tagColumn = {  content: <div style={{height:'120px', borderLeft:'1px solid #e0e0e0'}}>
                                  <div className={'jazz-energy-gridcomponent-header-item'}> {hieName} </div>
                                  <div className={'jazz-energy-gridcomponent-header-item'}> {tagName} </div>
                                  <div className={'jazz-energy-gridcomponent-header-item'} style={{ borderBottom:'0px'}}> {uom} </div>
                               </div>
                    };
    return tagColumn;
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
