'use strict';
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn, TableFooter } from 'material-ui';
import EnergyStore from '../../stores/Energy/EnergyStore.jsx';
import { getUomById, getCommodityById } from '../../util/Util.jsx';
import Pagination from '../../controls/paging/Pagination.jsx';

let GridComponent = React.createClass({

  propTypes: {
    energyData: React.PropTypes.object,
    energyRawData: React.PropTypes.object,
    chartStrategy: React.PropTypes.object
  },
  getInitialState() {
    return {
      fixedHeader: true,
      stripedRows: false,
      showRowHover: false,
      displayRowCheckbox: false,
      displaySelectAll: false,
      selectable: false,
      height: '500px'
    };
  },
  getFormatEnergyData(energyData) {
    let dataArray = energyData;
    let firstItems = dataArray[0].items;
    let gridData = [], row;
    for (let i = 0, len = firstItems.length; i < len; i++) {
      row = [
        <TableRowColumn style={{
          paddingRight: '0px'
        }}>
          {firstItems[i].localTime}
        </TableRowColumn>
      ];
      // row.localTime = {
      //   content: firstItems[i].localTime
      // };
      for (let k = 0; k < dataArray.length; k++) {
        // row[dataArray[k].TargetId + ''] = {
        //   content: dataArray[k].items[i].value
        // };
        row.push(
          <TableRowColumn style={{
            paddingLeft: '60px',
            paddingRight: '0',
            fontSize: '#14px',
            color: '#464949',
            height: '40px'
          }}>
            {dataArray[k].items[i].value}
          </TableRowColumn>
        )
      }
      gridData.push(<TableRow style={{
        height: '40px'
      }}>
        {row}
      </TableRow>);
    }
    return (
      <TableBody displayRowCheckbox={false} style={{
        paddingRight: '0',
        paddingLeft: '0',
        backgroundColor: '#fbfbfb',
        borderTop: '1px solid #e0e0e0'
      }}>
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}>
        {gridData}
      </TableBody>
      );
  },
  getHeaderCols(energyData) {
    let dataArray = energyData;

    // let headerCols = {
    //   localTime: {
    //     content: <div style={{
    //       marginLeft: '10px'
    //     }}>{'时间'}</div>
    //   }
    // };
    let headerCols = [
      <TableHeaderColumn style={{
        fontSize: '14px',
        color: '#abafae'
      }}>{I18N.RawData.Time}</TableHeaderColumn>
    ];

    for (let i = 0; i < dataArray.length; i++) {
      var tagOption = this.getTagInfo(dataArray[i]);
      headerCols.push(<TableHeaderColumn style={{
        paddingRight: '0',
        paddingLeft: '0'
      }}>{this.getTagColumnContent(tagOption.hieName, tagOption.tagName, tagOption.commodityAndUomName)}</TableHeaderColumn>)
    //headerCols[dataArray[i].TargetId + ''] = this.getTagColumnContent(tagOption.hieName, tagOption.tagName, tagOption.commodityAndUomName); //{content: dataArray[i].Name};
    }
    return (
      <TableHeader displaySelectAll={false} style={{
        backgroundColor: '#fbfbfb'
      }}>
         <TableRow>
           {headerCols}
         </TableRow>
      </TableHeader>
      );
  },
  getTagInfo(target) {
    var tagId = target.TargetId,
      tagOptions = EnergyStore.getTagOpions(),
      option, hieName, uom, uomName, commodity, commodityName, commodityAndUomName;

    for (let i = 0; i < tagOptions.length; i++) {
      option = tagOptions[i];
      if (option.tagId === tagId) {
        hieName = option.hierName.split('\\');
        hieName = hieName[hieName.length - 1];
        uom = getUomById(target.UomId);
        uomName = uom.Code;
        commodity = getCommodityById(target.CommodityId);
        commodityName = commodity.Comment;
        commodityAndUomName = commodityName + '/' + uomName;
        return {
          hieName: hieName,
          tagName: option.tagName,
          commodityAndUomName: commodityAndUomName
        };
      }
    }
  },
  getTagColumnContent(hieName, tagName, uom) {
    var tagColumn = (       <div style={{
            height: '107px',
            minHeight: '107px',
            borderLeft: '1px solid #e0e0e0'
          }}>
                                      <div className={'jazz-energy-gridcomponent-header-item'} title={
          hieName
          }> {hieName} </div>
                                      <div className={'jazz-energy-gridcomponent-header-item'} title={
          tagName
          }> {tagName} </div>
                                      <div className={'jazz-energy-gridcomponent-header-item'} style={{
            borderBottom: '0px'
          }} title={
          uom
          }> {uom} </div>
                                   </div>);
    return tagColumn;
  },
  // getColOrder(energyData) {
  //   let dataArray = energyData;
  //   let colOrder = ['localTime'];
  //   for (let i = 0; i < dataArray.length; i++) {
  //     colOrder.push(dataArray[i].TargetId + '');
  //   }
  //   return colOrder;
  // },
  getPageIndex() {
    let pageOrder = EnergyStore.getSubmitParams().viewOption.PagingOrder;
    return pageOrder.PageIdx;
  },
  getPageObj() {
    let pageIdx = this.getPageIndex();
    let totalCount = this.props.energyRawData.TotalCount;
    let pageSize = Math.ceil(totalCount / 20);

    return {
      pageSize: pageSize,
      pageIdx: pageIdx
    };
  },
  render() {
    let me = this;
    let energyData = this.props.energyData.toJS();
    let bodyCols = this.getFormatEnergyData(energyData);
    let headerCols = this.getHeaderCols(energyData);
    // let colOrder = this.getColOrder(energyData);
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
    return <div className='jazz-energy-gridcomponent-wrap' style={{
        marginLeft: '30px'
      }}>
      <Table
      height={this.state.height}
      fixedHeader={this.state.fixedHeader}
      selectable={this.state.selectable}>
      {headerCols}
      {bodyCols}
      </Table>
    </div>;
  },
  _previousPage() {
    let pageIdx = this.getPageIndex() - 1;
    pageIdx = pageIdx < 1 ? 1 : pageIdx;

    let tagOptions = EnergyStore.getTagOpions(),
      relativeDate = EnergyStore.getRelativeDate(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

    this.props.chartStrategy.getEnergyRawDataFn(timeRanges, 0, tagOptions, relativeDate, pageIdx);
  },
  _nextPage() {
    let pageIdx = this.getPageIndex() + 1;
    let tagOptions = EnergyStore.getTagOpions(),
      relativeDate = EnergyStore.getRelativeDate(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

    this.props.chartStrategy.getEnergyRawDataFn(timeRanges, 0, tagOptions, relativeDate, pageIdx);
  },
  _jumpToPage(pageNum) {
    let pageIdx = pageNum < 1 ? 1 : pageNum;
    let tagOptions = EnergyStore.getTagOpions(),
      relativeDate = EnergyStore.getRelativeDate(),
      paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

    this.props.chartStrategy.getEnergyRawDataFn(timeRanges, 0, tagOptions, relativeDate, pageIdx);
  }
});
module.exports = GridComponent;
