'use strict';
import React from "react";
import {Table} from 'material-ui';
import EnergyStore from '../../stores/energy/EnergyStore.jsx';
import {getUomById} from '../../util/Util.jsx';
import Pagination from '../../controls/paging/Pagination.jsx';

let GridComponent = React.createClass({

  propTypes:{
    energyData: React.PropTypes.object,
    energyRawData: React.PropTypes.object,
    chartStrategy:  React.PropTypes.object
  },
  getInitialState(){
    return {
      fixedHeader: true,
      stripedRows: true,
      showRowHover: true,
      displayRowCheckbox: false,
      displaySelectAll:false,
      selectable: false,
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
  getPageIndex(){
    let pageOrder = EnergyStore.getSubmitParams().viewOption.PagingOrder;
    return pageOrder.PageIdx;
  },
  getPageObj(){
    let pageIdx = this.getPageIndex();
    let totalCount = this.props.energyRawData.TotalCount;
    let pageSize = Math.ceil(totalCount/20);

    return {pageSize: pageSize, pageIdx: pageIdx};
  },
  render(){
    let me = this;
    let energyData = this.props.energyData.toJS();
    let rowData = this.getFormatEnergyData(energyData);
    let headerCols = this.getHeaderCols(energyData);
    let colOrder = this.getColOrder(energyData);
    let pageObj = this.getPageObj(this.props.energyRawData);

    let pagingPropTypes = {
      curPageNum: pageObj.pageIdx,
      totalPageNum: pageObj.pageSize,
      previousPage: me._previousPage,
      nextPage: me._nextPage,
      jumpToPage: me._jumpToPage,
      hasJumpBtn: true
    };

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
      <Pagination {...pagingPropTypes}></Pagination>
    </div>;
  },
  _previousPage(){
    let pageIdx = this.getPageIndex() - 1;
    pageIdx = pageIdx < 1 ? 1: pageIdx;

    let tagOptions = EnergyStore.getTagOpions(),
        relativeDate = EnergyStore.getRelativeDate(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;

    this.props.chartStrategy.getEnergyRawDataFn(timeRanges, 0, tagOptions, relativeDate, pageIdx);
  },
  _nextPage(){
    let pageIdx = this.getPageIndex() + 1;
    let tagOptions = EnergyStore.getTagOpions(),
    relativeDate = EnergyStore.getRelativeDate(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;

    this.props.chartStrategy.getEnergyRawDataFn(timeRanges, 0, tagOptions, relativeDate, pageIdx);
  },
  _jumpToPage(pageNum){
    let pageIdx = pageNum < 1 ? 1 : pageNum;
    let tagOptions = EnergyStore.getTagOpions(),
    relativeDate = EnergyStore.getRelativeDate(),
        paramsObj = EnergyStore.getParamsObj(),
        timeRanges = paramsObj.timeRanges;

    this.props.chartStrategy.getEnergyRawDataFn(timeRanges, 0, tagOptions, relativeDate, pageIdx);
  }
});
module.exports = GridComponent;
