import React from 'react';
import moment from 'moment';
import mui from 'material-ui';
import classSet from 'classnames';
import CommonFuns from '../../../util/Util.jsx';
import EnergyStore from '../../../stores/energy/EnergyStore.jsx';
import Immutable from 'immutable';
let {dateAdd} = CommonFuns;

let {Dialog, Table, FlatButton} = mui;

let SumWindow = React.createClass({
  propTypes:{
    analysisPanel: React.PropTypes.object
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
  isMultiInterval: function(){
    var paramsObj = EnergyStore.getSubmitParams(),
        timeRanges = paramsObj.viewOption.TimeRanges;
    return timeRanges.length > 1;
  },
  getTimeRange: function(){
    let analysisPanel = this.props.analysisPanel;
    var timeRange = analysisPanel.refs.dateTimeSelector.getDateTime();
    return timeRange;
  },
  buildGridTitle: function(){
    if(this.isMultiInterval()){
      var tagOption = EnergyStore.getTagOpions()[0];
      var tagName = tagOption.tagName;
      return tagName;
    }
    else{
      let analysisPanel = this.props.analysisPanel;
      var timeRange = this.getTimeRange();
      var startDate = timeRange.start;
      var endDate = timeRange.end;
      var end;
      var start = moment(startDate).format(I18N.DateTimeFormat.IntervalFormat.FullMinute);
      if(endDate.getHours() === 0) {
          endDate = dateAdd(endDate, -1, 'days');
          end = moment(endDate).format(I18N.DateTimeFormat.IntervalFormat.FullDay) + ' ' + I18N.EM.Clock24Minute0;
      }
      else{
        end = moment(endTime).format(I18N.DateTimeFormat.IntervalFormat.FullMinute);
      }
      var label = start + ' ' + I18N.EM.To + ' ' + end;
      return label;
    }
  },
  buildData: function () {
    var data = [];
    var highstock = this.props.analysisPanel.refs.ChartComponent.refs.highstock;
    if(highstock){
      var chartObj = highstock._paper,
          series = chartObj.series,
          serie, uom = '', isAllNull,
          decimalDigits, serieDecimalDigits,
          timeRange = this.getTimeRange();

      var item, total, processedXData, xData;
      for (var i = 0, len = series.length; i < len; i++) {
        serie = series[i];
        //只记录有legend的serie
        if (serie.legendItem) {
          item = {};
          item.name = serie.userOptions.fullName || serie.name;
          if(!!this.isMultiInterval) {
            item.name = item.name.replace('<br/>', ' ' + I18N.EM.To + ' ');
          }
          if (serie.options.option.uom) {
            uom = serie.options.option.uom;
          }

          processedXData = serie.processedXData;
          isAllNull = true;
          decimalDigits = 0;
          if(processedXData && processedXData.length > 0){
            total = 0;
            for(var j = 0, dataLen = processedXData.length; j < dataLen; j++){
              xData = processedXData[j];
              if(CommonFuns.isNumber(serie.processedYData[j]) && xData >= timeRange.start.getTime() && xData <= timeRange.end.getTime()){
                total += serie.processedYData[j];
                isAllNull = false;

                serieDecimalDigits = CommonFuns.getDecimalDigits(serie.processedYData[j]);
                if(serieDecimalDigits > 0 && serieDecimalDigits > decimalDigits){
                  decimalDigits = serieDecimalDigits;
                }
              }
            }
            if (isAllNull){
              item.sum = '';
            }
            else{
              if(decimalDigits > 0){
                total = CommonFuns.toFixed(total, decimalDigits);
              }
                //total = cmp.dataLabelFormatter.call({ value: total }, false);
              item.sum = total + uom;
            }
          }
          data.push(item);
        }
      }
    }
    return data;
  },
  getRowData(){
    var data = this.buildData();
    let rowData = [], row;
    for(var i = 0; i < data.length; i++){
      row = {};
      row.name = {content:data[i].name};
      row.sum = {content:data[i].sum};
      rowData.push(row);
    }
    return rowData;
  },
  getColOrder(energyData){
      let colOrder = ['name', 'sum'];
      return colOrder;
  },
  getHeaderCols(){
    let headerCols = {};
    if(this.isMultiInterval()){
      headerCols.name = {
        content: <div style={{marginLeft:'10px'}}>{'时间段'}</div>
      };
    }
    else{
      headerCols.name = {
        content: <div style={{marginLeft:'10px'}}>{'数据点'}</div>
      };
    }
    headerCols.sum = {content: '总计'};
    return headerCols;
  },
  _onAction(action){
    let analysisPanel = this.props.analysisPanel;
    if(action === 'ok'){

    }
    analysisPanel.setState({showSumDialog: false});
  },
  render(){
    let me = this;
    let rowData = this.getRowData();
    let headerCols = this.getHeaderCols();
    let colOrder = this.getColOrder();

    var sumTable = <div className='jazz-energy-gridcomponent-wrap'><Table
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
    let _buttonActions = [
          <FlatButton
          label="好"
          onClick={me._onAction.bind(me, 'ok')} />];
    let titleEl = <div style={{fontSize:'20px', padding:'24px 0 0 50px'}}>{'数据求和'}</div>;
    let label = this.buildGridTitle();
    let dialog = <Dialog {...me.props} title={titleEl} actions={_buttonActions} modal={true}
                    contentClassName='jazz-add-interval-dialog'>
                    <div style={{height:'418px'}}>
                      <div>{label}</div>
                      {sumTable}
                    </div>
                  </Dialog>;

    return <div>
             {dialog}
           </div>;
  }
});
module.exports = SumWindow;
