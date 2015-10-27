import React from 'react';
import moment from 'moment';
import mui from 'material-ui';
import classSet from 'classnames';
import CommonFuns from '../../../util/Util.jsx';
import EnergyStore from '../../../stores/energy/EnergyStore.jsx';
import Immutable from 'immutable';
let {dateAdd} = CommonFuns;

let {Dialog, FlatButton, Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn} = mui;

let SumWindow = React.createClass({
  propTypes: {
    analysisPanel: React.PropTypes.object
  },
  getInitialState() {
    return {
      fixedHeader: true,
      stripedRows: true,
      showRowHover: true,
      displayRowCheckbox: false,
      displaySelectAll: false,
      selectable: false,
      height: '500px'
    };
  },
  isMultiInterval: function() {
    var paramsObj = EnergyStore.getSubmitParams(),
      timeRanges = paramsObj.viewOption.TimeRanges;
    return timeRanges.length > 1;
  },
  getTimeRange: function() {
    let analysisPanel = this.props.analysisPanel;
    var timeRange = analysisPanel.refs.dateTimeSelector.getDateTime();
    return timeRange;
  },
  getSumTimeRange: function(xAxis) {
    var min = xAxis.min,
      max = xAxis.max,
      start = Math.round(min),
      end = Math.round(max);

    var startTime, endTime;

    startTime = new Date(start);
    startTime.setMinutes(0, 0, 0);
    endTime = new Date(end);
    endTime.setMinutes(0, 0, 0);

    return [startTime.getTime(), endTime.getTime()];
  },
  buildGridTitle: function() {
    if (this.isMultiInterval()) {
      var tagOption = EnergyStore.getTagOpions()[0];
      var tagName = tagOption.tagName;
      return tagName;
    } else {
      let analysisPanel = this.props.analysisPanel;
      var timeRange = this.getTimeRange();
      var startDate = timeRange.start;
      var endDate = timeRange.end;
      var end;
      var start = moment(startDate).format(I18N.DateTimeFormat.IntervalFormat.FullMinute);
      if (endDate.getHours() === 0) {
        endDate = dateAdd(endDate, -1, 'days');
        end = moment(endDate).format(I18N.DateTimeFormat.IntervalFormat.FullDay) + ' ' + I18N.EM.Clock24Minute0;
      } else {
        end = moment(endDate).format(I18N.DateTimeFormat.IntervalFormat.FullMinute);
      }
      var label = start + ' ' + I18N.EM.To + ' ' + end;
      return label;
    }
  },
  buildData: function() {
    var data = [];
    var highstock = this.props.analysisPanel.refs.ChartComponent.refs.highstock;
    if (highstock) {
      var chartObj = highstock._paper,
        series = chartObj.series,
        serie,
        uom = '', isAllNull,
        decimalDigits, serieDecimalDigits,
        timeRange = this.getSumTimeRange(chartObj.xAxis[0]);

      var item, total, processedXData, xData;
      for (var i = 0, len = series.length; i < len; i++) {
        serie = series[i];
        //只记录有legend的serie
        if (serie.legendItem) {
          item = {};
          item.name = serie.userOptions.fullName || serie.name;
          if (!!this.isMultiInterval) {
            item.name = item.name.replace('<br/>', ' ' + I18N.EM.To + ' ');
          }
          if (serie.options.option.uom) {
            uom = serie.options.option.uom;
          }

          processedXData = serie.processedXData;
          isAllNull = true;
          decimalDigits = 0;
          if (processedXData && processedXData.length > 0) {
            total = 0;
            for (var j = 0, dataLen = processedXData.length; j < dataLen; j++) {
              xData = processedXData[j];
              if (CommonFuns.isNumber(serie.processedYData[j]) && xData >= timeRange[0] && xData <= timeRange[1]) {
                total += serie.processedYData[j];
                isAllNull = false;

                serieDecimalDigits = CommonFuns.getDecimalDigits(serie.processedYData[j]);
                if (serieDecimalDigits > 0 && serieDecimalDigits > decimalDigits) {
                  decimalDigits = serieDecimalDigits;
                }
              }
            }
            if (isAllNull) {
              item.sum = '';
            } else {
              if (decimalDigits > 0) {
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
  getBodyCols() {
    var data = this.buildData();
    let rowData = [],
      row = [];
    for (var i = 0; i < data.length; i++) {
      row = [
        <TableRowColumn style={{
          paddingLeft: '60px',
          paddingRight: '0px'
        }}>{data[i].name}</TableRowColumn>,
        <TableRowColumn style={{
          paddingLeft: '45px',
          paddingRight: '0px',
          fontSize: '14px',
          color: '#464949'
        }}>{data[i].sum}</TableRowColumn>
      ];
      rowData.push(<TableRow>
        {row}
      </TableRow>);
    }
    return (
      <TableBody displayRowCheckbox={false} style={{
        backgroundColor: '#fbfbfb'
      }}>
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}>
        {rowData}
      </TableBody>
      );
  },
  getHeaderCols() {
    let headerCols = [];
    if (this.isMultiInterval()) {
      headerCols.push(<TableHeaderColumn style={{
        paddingRight: '0px',
        paddingLeft: '0px',
        fontSize: '14px',
        color: '#abafae'
      }}>{I18N.SumWindow.TimeSpan}</TableHeaderColumn>);
    } else {
      headerCols.push(<TableHeaderColumn style={{
        paddingRight: '0px',
        paddingLeft: '0px',
        fontSize: '14px',
        color: '#abafae'
      }}>{I18N.SumWindow.Data}</TableHeaderColumn>);
    }
    headerCols.push(<TableHeaderColumn style={{
      fontSize: '14px',
      color: '#abafae'
    }}>{I18N.SumWindow.Sum}</TableHeaderColumn>);
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
  _onAction(action) {
    let analysisPanel = this.props.analysisPanel;
    if (action === 'ok') {

    }
    analysisPanel.setState({
      showSumDialog: false
    });
  },
  render() {
    let me = this;
    let bodyCols = this.getBodyCols();
    let headerCols = this.getHeaderCols();

    var sumTable = <div className='jazz-energy-sumcomponent-wrap'><Table
    fixedHeader={this.state.fixedHeader}
    selectable={this.state.selectable}
    >
    {headerCols}
    {bodyCols}
  </Table>
    </div>;
    let _buttonActions = [
      <FlatButton
      label="好"
      onClick={me._onAction.bind(me, 'ok')} />];
    let titleEl = <div style={{
      fontSize: '20px',
      padding: '24px 0 0 50px'
    }}>{'数据求和'}</div>;
    let label = this.buildGridTitle();
    let dialog = <Dialog {...me.props} title={titleEl} actions={_buttonActions} modal={true}
    contentClassName='jazz-add-interval-dialog'>
                    <div style={{
      height: '418px',
      display: 'flex',
      flexDirection: 'column'
    }}>
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
