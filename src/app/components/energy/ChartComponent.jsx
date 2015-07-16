'use strict';

import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';
import mui from 'material-ui';
import Highstock from '../highcharts/Highstock.jsx';
import ChartXAxisSetter from './ChartXAxisSetter.jsx';
import EnergyCommentFactory from './EnergyCommentFactory.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import {dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon} from '../../util/Util.jsx';

let { Dialog, FlatButton, Checkbox } = mui;
let yAxisOffset = 70;

var dataLabelFormatter = function (format) {
    var f = window.Highcharts.numberFormat;
    var v = Number(this.value);
    var sign = this.value < 0 ? -1 : 1;

    v = Math.abs(v);
    if (v === 0) {
        if (format === false) {
            return this.value;
        }
        else {
            return v;
        }
    }
    if (v < Math.pow(10, 3)) {
        if (format === false) {
            return v * sign;
        }
        else {
            return f(v * sign, 2);
        }
    }
    else if (v < Math.pow(10, 6)) {
        if (format === false) {
            var len = parseInt(v / 1000).toString().length;
            var v1 = v.toString();
            var retV = v1.substring(0, len) + ',' + v1.substring(len);
            if (sign < 0) retV = '-' + retV;
            return retV;
        }
        else {
            return f(v * sign, 0);
        }
    }
    else if (v < Math.pow(10, 8)) {
        v = f(parseInt(v / Math.pow(10, 3)) * sign, 0) + 'k';
    }
    else if (v < Math.pow(10, 11)) {
        v = f(parseInt(v / Math.pow(10, 6)) * sign, 0) + 'M';
    }
    else if (v < Math.pow(10, 14)) {
        v = f(parseInt(v / Math.pow(10, 9)) * sign, 0) + 'G';
    }
    else if (v < Math.pow(10, 17)) {
        v = f(parseInt(v / Math.pow(10, 12)) * sign, 0) + 'T';
    }
    return v;
};
let defaultConfig = {
    colors: [
                '#3399cc',
                '#99cc66',
                '#996699',
                '#cccc33',
                '#663366',
                '#cc6666',
                '#6699cc',
                '#cc9999',
                '#cc3399',
                '#cccc00',
                '#cc6633',
                '#336666',
                '#669933',
                '#6699ff',
                '#66cccc',
                '#3399ff',
                '#66cc66',
                '#996699',
                '#999966',
                '#669999',
                '#996666',
                '#666699',
                '#669966',
                '#cc3366',
                '#99cc00',
                '#cc9933',
                '#666666',
                '#99cc99',
                '#ffcc66',
                '#336699'
    ],
    lang: {
        loading: 'loading',
        months: [],
        shortMonths: [],
        weekdays: [],
        decimalPoint: '.',
        resetZoom: '取消放大/缩小',
        resetZoomTitle: '缩放至1:1',
        thousandsSep: ','
    },
    chart: {
        panning: false,
        backgroundColor:  "#FBFBFB",
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        borderRadius: 0,
        resetZoomButton: false,
        events: {
            load: function () {
                var offset = yAxisOffset;
                for (var i = 0, len = this.yAxis.length; i < len && i < 3; ++i) {
                    var y = this.yAxis[i];
                    var left, top = y.top - 6 - 10;
                    if (!y.options.opposite) {
                        left = this.options.chart.spacingLeft || 12;
                    }
                    else {
                        left = y.left + this.plotWidth + 5 + (offset * (i - 1));
                    }
                    if (!y.yTitle && y.options.yname && y.hasVisibleSeries) {
                        var name = y.options.yname.replace('Person', '人');
                        var yTitle = this.renderer.text(name, left, top).add();
                        y.yTitle = yTitle;
                    }

                }
            },
            redraw: function () {
                var offset = yAxisOffset;
                for (var i = 0, len = this.yAxis.length; i < len && i < 3; ++i) {
                    var y = this.yAxis[i];
                    var title = y.yTitle;
                    var left, top = y.top - 6 - 10;
                    if (!y.options.opposite) {
                        left = this.options.chart.spacingLeft || 12;
                    }
                    else {
                        left = y.left + this.plotWidth + 5 + (offset * (i - 1));
                    }
                    if (title) {
                        title.attr({
                            x: left,
                            y: top
                        });
                    }
                    else {
                        if (y.options.yname) {
                            var name = y.options.yname.replace('Person', '人');
                            var yTitle = this.renderer.text(name, left, top).add();
                            y.yTitle = yTitle;
                        }
                    }
                    if (y.yTitle) {
                        var show = false;
                        for (var j = 0; j < y.series.length; ++j) {
                            var s = y.series[j];
                            if (s.visible) {
                                show = true;
                                break;
                            }
                        }

                        if (!show) {
                            y.yTitle.attr({
                                display: 'none'
                            });
                            y.yTitle.attr({
                                visibility: 'hidden'
                            });
                        }
                        else {
                            y.yTitle.attr({
                                display: 'block'
                            });
                            y.yTitle.attr({
                                visibility: 'visible'
                            });
                        }
                    }
                }
            }
        }
    },
    exporting: {
        buttons: {
            contextButton: {
                enabled: false
            }
        }
    },
    xAxis: {
        ordinal: false,//must false for missing data
        type: 'datetime',
        tickPositioner: function (min, max) {
            return ChartXAxisSetter.statics.setTicks.apply(this, arguments);
        },
        crosshair: true,
        labels: {
            overflow: 'justify'
        },
        dateTimeLabelFormats: {}
    },
    rangeSelector: {
        enabled: false
    },
    navigator: {
        enabled: true,
        margin: 25,
        adaptToUpdatedData: false,
        xAxis: {
            ordinal: false,
            labels: {
                formatter: function () {
                    var v = this.value;
                    var chart = this.chart;
                    var step = chart.options.navigator.step;
                    if (step == 4) {
                        return dateFormat(new Date(v), 'YYYY年');
                    }
                    else {
                        return dateFormat(new Date(v), 'YYYY年MM月');
                    }
                }
            }
        },
        yAxis: {
            min: 0
        }
    },
    scrollbar: {
        enabled: true,
        liveRedraw: true
    },
    style: { "fontSize": "12px", fontFamily: 'Microsoft YaHei' },
    legend: {
        deleteAllButtonText:'全部清除',
        enabled: true,
        layout: 'vertical',
        verticalAlign: 'top',
        y: 40,
        x: -25,
        itemStyle: {
            cursor: 'default',
            color: '#3b3b3b',
            "fontWeight": "normal"
        },
        itemHoverStyle: {
            cursor: 'pointer',
            color: '#000'
        },
        borderWidth: 0,
        margin: 10,
        align: 'right',
        itemMarginTop: 6,
        itemMarginBottom: 6
    },
    //delete Highcharts.com label
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: true,
        hideDelay: 100,
        shape: 'square',
        xDateFormat: '%Y-%m-%d %H:%M:%S'
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true,
                radius: 3
            }
        },
        column: {
            dataGrouping: { enabled: false },
            groupPadding: 0.1,
            shadow: false,
            borderWidth: 0,
            pointPadding: 0,
            dataLabels: {
                enabled: false,
                shadow: true,
                borderRadius: 5,
                backgroundColor: 'white',
                padding: 10,
                borderWidth: 1,
                borderColor: '#AAA',
                y: -40
            }
        },
        line: {
            dataGrouping: { enabled: false },
            zIndex: 10,
            point: {
                events: {
                    click: function (event) {
                        var chart = this.series.chart;
                        chart.trigger('editComment', { event: event, point: this });
                    }
                }
            }, dataLabels: {
                enabled: false,
                shadow: true,
                borderRadius: 5,
                backgroundColor: 'white',
                padding: 10,
                borderWidth: 1,
                borderColor: '#AAA',
                y: -40
            }
        }
    }
};

let ChartComponent = React.createClass({
    propTypes: {
        onDeleteButtonClick: React.PropTypes.func,
        onDeleteAllButtonClick: React.PropTypes.func,
        afterChartCreated: React.PropTypes.func,
    },
    getInitialState() {
        return {

        };
    },
    componentWillMount(){
      this.initDefaultConfig();
    },
    componentWillUnmount() {

    },
    componentDidMount(){

    },
    componentWillReceiveProps(nextProps) {
    },
    componentWillUpdate(){

    },
    shouldComponentUpdate: function(nextProps, nextState) {
      return !(this.props.energyData.equals(nextProps.energyData));

    },
    initDefaultConfig: function () {
      let cap = function(string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        };
      var t = ['millisecond', 'second', 'minute', 'hour', 'day', 'dayhour', 'week', 'month', 'fullmonth', 'year'],
          c = defaultConfig,
          x = c.xAxis,
          f = I18N.DateTimeFormat.HighFormat;

      t.forEach(function (n) {
          x.dateTimeLabelFormats[n] = (f[cap(n)]);
      });

      c.chart.cancelChartContainerclickBubble = true;
    },
    _onIgnoreDialogSubmit(){
      let isBatchIgnore = this.refs.batchIgnore.isChecked();
      let point = this.selectedIgnorePoint,
          factory = EnergyCommentFactory,
          ids, ignorePoints = [];
      if(isBatchIgnore){
        ids = factory.getContinuousPointids(point, ignorePoints, this.props.step);

      }else{
        ids = point.alarmId;
        ignorePoints.push(point);
      }
      AlarmAction.ignoreAlarm(ids, isBatchIgnore, ignorePoints);
      this.refs.ignoreDialogWindow.dismiss();
    },
    _onIgnoreDialogCancel(){
      this.refs.ignoreDialogWindow.dismiss();
    },
    render () {

      let that = this;
      if(!this.props.energyData) {
          return null;
      }
      var _buttonActions = [
              <FlatButton
              label="忽略"
              secondary={true}
              onClick={this._onIgnoreDialogSubmit} />,
              <FlatButton
              label="放弃"
              primary={true}
              onClick={this._onIgnoreDialogCancel} style={{marginRight:'364px'}}/>
          ];

      var dialog = <Dialog actions={_buttonActions} modal={false} ref="ignoreDialogWindow" contentStyle={{width:'600px'}}>
        <div style={{fontSize:'20px', fontWeight:'bold', padding:'0px 0 0 24px'}}>忽略该点报警吗？</div>
        <div style={{margin:'30px auto 10px 24px'}}> <Checkbox ref='batchIgnore'  label='忽略该点后的连续报警'/></div>
      </Dialog>;

      let highstockEvents = {onDeleteButtonClick:that._onDeleteButtonClick,
                             onDeleteAllButtonClick: that._onDeleteAllButtonClick,
                             onIgnoreAlarmEvent: that.onIgnoreAlarmEvent,
                             afterChartCreated: that._afterChartCreated};
      return <div style={{display:'flex', flex:1}}>
                <Highstock ref="highstock" options={that._initChartObj()} {...highstockEvents}></Highstock>
                {dialog}
             </div>;

  },
  _afterChartCreated(chartObj){
    this.props.afterChartCreated(chartObj);
  },
  _onDeleteButtonClick(obj){
    if(this.props.onDeleteButtonClick){
      this.props.onDeleteButtonClick(obj);
    }
  },
  _onDeleteAllButtonClick(){
    if(this.props.onDeleteAllButtonClick){
      this.props.onDeleteAllButtonClick();
    }
  },
  onIgnoreAlarmEvent(obj){
    let point = obj.point;
        this.refs.ignoreDialogWindow.show();
        this.selectedIgnorePoint = point;

        return false;
  },
  _initChartObj() {
    var data = this.props.energyData.toJS();
    var newConfig = assign({}, defaultConfig,
      {animation: true,
       title: {
                text: this.title,
                x: -75,
                margin: 85,
                style: {
                    'font-size': '14px',
                    'font-family': 'Microsoft YaHei, Segoe UI, tahoma,arial,verdana,sans-serif'
                }
            }
      });

      newConfig.tooltip.shared = true;
      newConfig.tooltip.crosshairs = true;
      newConfig.navigator.step = this.props.step;

      this.mergeConfig(newConfig);

      this.initYaxis(data.Data, newConfig);

      var realData = this.convertData(data.Data, newConfig);
      var timeRange = this.initRange(newConfig, realData);
      this.initNavigatorData(newConfig, timeRange, data);

      this.initFlagSeriesData(newConfig, realData);

      newConfig.tooltipSidePosition = true;

      return newConfig;

  },
  mergeConfig: function (defaultConfig) {

    var commonTooltipFormatter = function () {
        var op = this.points[0].series.options.option,
            start = op.start,
            end = op.end, uom,
            step = op.targetStep || op.step,
            decimalDigits, serieDecimalDigits;
        var str = formatDateByStep(this.x, start, end, step);
        str += '<br/>';
        var total = 0;
        decimalDigits = 0;
        for (var i = 0; i < this.points.length; ++i) {
            var point = this.points[i],
                series = point.series,
                name = series.name,
                color = series.color;

                uom = series.options.option.uom;
            str += I18N.format('<span style="color:{0}">{1}: <b>{2}{3}</b></span><br/>',
                color, name, dataLabelFormatter.call({ value: point.y }, false), uom);
            if (isNumber(point.y)) {
                total += point.y;

                serieDecimalDigits = getDecimalDigits(point.y);
                if (serieDecimalDigits > 0 && serieDecimalDigits > decimalDigits) {
                    decimalDigits = serieDecimalDigits;
                }
            }
        }
        if (decimalDigits > 0) {
            total = toFixed(total, decimalDigits);
        }
        total = dataLabelFormatter.call({ value: total }, false);
        if (this.points.length > 1 && this.points[0].series.chart.userOptions.chartTooltipHasTotal) {
            str += '总计：<b>' + total + uom + '</b>';
        }
        return str;
    };

    defaultConfig.tooltip.formatter = commonTooltipFormatter;
  },

  convertData: function (data, config) {
      var ret = [];
      for (var j = 0; j < data.length; ++j) {
          var item = data[j];
          var n = item.name;
          var isBenchmarkLine = item.dType == 15;
          if (n.indexOf('<br') < 0) {//hack for multi-timespan compare
             n = JazzCommon.GetArialStr(n, 23); //greater than 23 then truncate with ...
          }
          let enableDelete = true;
          if(item.dType == 13 || item.dType == 14 || item.dType == 15){
            enableDelete = false;
          }
          var s = {
              type: 'line',
              name: n,
              enableDelete: enableDelete,
              enableHide: !!!item.disableHide,
              data: item.data,
              option: item.option,
              uid: item.uid,
              id: item.uid + '' + item.dType,
              seriesKey: item.seriesKey,
              graySerie: item.hasOwnProperty('graySerie') ? item.graySerie : (item.hasOwnProperty('visible') ? !item.visible : false)
          };

          if (isBenchmarkLine) {
              //benchmark line color
              s.color = '#f15e31';
              s.lineWidth = 4;

              s.states = s.states || {};
              s.states.hover = s.states.hover || {};
              s.states.hover.enabled = true;
              s.states.hover.lineWidth = 4;

              s.marker = {
                  enabled: true, radius: 6, lineWidth: 2, lineColor: 'white',
                  states: { hover: { enabled: true, radius: 8, lineWidth: 2, lineColor: 'white' } }
              };

              s.shadow = {
                  color: 'grey',
                  width: 3,
                  offsetX: 0,
                  offsetY: 3
              };
          }

          this.convertSingleItem(item, s);

          var yList = config.yAxis; //pie chart don't return yAxis
          if (yList && yList.length > 0) {
              for (var i = 0; i < yList.length; ++i) {
                  if (yList[i].yname == s.option.uom) {
                      s.yAxis = i;
                  }
              }

          }
          ret.push(s);
      }

      return ret;
  },
  convertSingleItem: function (item, s) {
      var d = s.data;
      if (!d) return;

      var converter = DataConverter,
          endTime = converter.JsonToDateTime(this.props.endTime, true),
          startTime = converter.JsonToDateTime(this.props.startTime, true);


      if (_.isArray(d) && d.length === 0) {
          d = [[startTime, null], [endTime, null]];
      }
      else {
          var step = s.option.step;
          var range = 100000 ;
          switch (step) {
              case 1: //hour add 30mins
                  range = 3600000;
                  break;
              case 2: //day add 12hours
                  range =  24 * 3600000;
                  break;
              case 3: //month add 15days
                  range = 30 * 24 * 3600000;
                  break;
              case 4: //2010年 add 6months
                  range = 12 * 30 * 24 * 3600000;
                  break;
              case 5: //week add 3days&12hours
                  range = 7 * 24 * 3600000;
                  break;
          }
          if (_.isArray(d)) {
              var currentTime = (new Date()).getTime();
              while (d[0][0] > startTime) {
                  d.unshift([d[0][0] - range, null]);
              }

              var realEndTime = DataConverter.JsonToDateTime(this.props.endTime, true);

              currentTime = currentTime > realEndTime ? currentTime : realEndTime;
              if (d[d.length - 1][0] < currentTime) {
                  while (d[d.length - 1][0] < currentTime) {
                      d.push([d[d.length - 1][0] + range, null]);
                  }
                  if (d[d.length - 1][0] > currentTime) {
                      d.pop();
                  }
              }
          }
      }
  },
  initRange: function (newConfig, realData) {

       var converter = DataConverter;
       var j2d = converter.JsonToDateTime;
       var endTime = j2d(this.props.endTime, true);
       var startTime = j2d(this.props.startTime, true);

       newConfig.series = realData;
       if (realData && realData.length > 1) {
           this.navCache = true;
           newConfig.scrollbar.liveRedraw = true;
       }
       else {
           this.navCache = true;
       }
       if (this.props.step === 1 || this.props.step === 0) {
           this.navCache = false;
           newConfig.scrollbar.liveRedraw = false;
       }

       newConfig.xAxis.min = startTime;
       var nowBound = new Date();
       nowBound.setMinutes(0, 0, 0);
       //#2488
       switch (this.props.step) {
           case 0:
               endTime = new Date(endTime);
               startTime = new Date(startTime);
               nowBound.setMinutes(endTime.getMinutes(), 0, 0);
               break;
           case 1:
               endTime = new Date(endTime);
               if (endTime.getMinutes() < 30) {
                   endTime = dateAdd(new Date(endTime), 1, 'hours');
               }
               nowBound = dateAdd(nowBound, 1, 'hours');
               startTime = new Date(startTime);
               break;
           case 2:
               endTime = new Date(endTime);
               if (endTime.getHours() > 0 && endTime.getHours() < 12) {
                   endTime = dateAdd(new Date(endTime), 1, 'days');
               }
               startTime = new Date(startTime);
               if (startTime.getHours() !==0 && startTime.getHours() <= 12) {
                   startTime.setHours(13);
                   newConfig.xAxis.min = startTime.getTime();
               }
               nowBound.setHours(0);
               nowBound = dateAdd(nowBound, 1, 'days');
               break;
           case 3:
               endTime = new Date(endTime);
               if (!(endTime.getDate() === 1 && endTime.getHours() === 0)) {
                   if (endTime.getDate() < 15) {
                       endTime = dateAdd(new Date(endTime), 1, 'months');
                   }
               }
               startTime = new Date(startTime);
               if (startTime.getDate() > 1 && startTime.getDate() <= 16) {
                   startTime.setDate(17);
                   newConfig.xAxis.min = startTime.getTime();
               }
               nowBound.setDate(1);
               nowBound.setHours(0);
               nowBound = dateAdd(nowBound, 1, 'months');
               break;
           case 4:
               endTime = new Date(endTime);
               if (!(endTime.getMonth() === 0 && endTime.getDate() === 1 && endTime.getHours() === 0)) {
                   if (endTime.getMonth() < 5) {
                       endTime = dateAdd(new Date(endTime), 1, 'years');
                   }
               }
               startTime = new Date(startTime);
               if (!(startTime.getMonth() === 0 && startTime.getDate() === 1 && startTime.getHours() === 0)) {

                   if (startTime.getMonth() > 0 && startTime.getMonth() <= 6) {
                       startTime.setMonth(7);
                       newConfig.xAxis.min = startTime.getTime();
                   }
               }
               nowBound.setMonth(0, 1);
               nowBound.setHours(0);
               nowBound = dateAdd(nowBound, 1, 'years');
               break;
           case 5:
               endTime = new Date(endTime);
               if (!(endTime.getDay() === 1 && endTime.getHours() === 0)) {
                   if (endTime.getDay() !== 0 && (endTime.getDay() < 3 || (endTime.getDay() < 4 && endTime.getHours() < 12))) {
                       endTime = dateAdd(new Date(endTime), 7, 'days');
                   }
               }
               startTime = new Date(startTime);
               if (startTime.getDay() !== 1 && startTime.getDay() !== 0 && startTime.getDay() < 4) { //not monday

                   startTime = dateAdd(startTime, 5 - startTime.getDay(), 'days');

                   newConfig.xAxis.min = startTime.getTime();
               }
               if (nowBound.getDay() === 0) {
                   nowBound = dateAdd(nowBound, -6, 'days');
               }
               else {
                   nowBound = dateAdd(nowBound, 1 - nowBound.getDay(), 'days');
               }
               nowBound.setHours(0);
               nowBound = dateAdd(nowBound, 7, 'days');
               break;
           case 6:
               endTime = new Date(endTime);
               startTime = new Date(startTime);
               nowBound.setMinutes(endTime.getMinutes(), 0, 0);
               break;
           case 7:
               endTime = new Date(endTime);
               if (endTime.getMinutes() < 30) {
                   endTime = dateAdd(new Date(endTime), 1, 'hours');
               }
               nowBound = dateAdd(nowBound, 1, 'hours');
               startTime = new Date(startTime);
               break;
       }
       newConfig.xAxis.max = endTime.getTime();

       return [startTime, endTime, nowBound];
   },
   initNavigatorData: function (newConfig, timeRange, data) {
       var startTime = timeRange[0], endTime = timeRange[1], nowBound = timeRange[2];
       if (newConfig.navigator.enabled && data.Navigator) {

           var navData = data.Navigator;
           var numStartTime = startTime,
               numEndTime = endTime;
               numStartTime = startTime.getTime();
               numEndTime = endTime.getTime();

           var navStart = navData[0][0],
               navShouldBeStartAt = numStartTime,
               navShouldBeEndAt = numEndTime;

           for (var i = 0; i < newConfig.series.length; i++) {
               var s = newConfig.series[i];
               if (!s.data || s.data.length === 0) continue;
               var sMin = s.data[0][0], sMax = s.data[s.data.length - 1][0];
               if (sMin < navShouldBeStartAt) navShouldBeStartAt = sMin;
               if (sMax > navShouldBeEndAt) navShouldBeEndAt = sMax;
           }
           navShouldBeEndAt = this.arrayMax([navShouldBeEndAt, new Date(), DataConverter.JsonToDateTime(this.props.endTime)]);

           // Oscar: Fix bug #5615. Disable the stickToMax function in highstock. Search "stickToMax" in highstock source code for detail
           navShouldBeEndAt++;
           // #5615 fixing end

           if (navData[0][0] > navShouldBeStartAt) {
               navData.unshift([navShouldBeStartAt, null]);
           }
           if (navData[navData.length - 1][0] < navShouldBeEndAt) {
               navData.push([navShouldBeEndAt, null]);
           }

           newConfig.navigator.xAxis.max = navData[navData.length - 1][0];
           newConfig.navigator.series = { data: navData, dataGrouping: { enabled: false } };

           if (newConfig.series.length > 0) {
               if (newConfig.series[0].data.length === 0) {
                   newConfig.series[0].data = [[numStartTime, null], [numEndTime, null]];
               }
               else {
               }
           }

       }
       else {
           newConfig.navigator.enabled = false;
           newConfig.navigator.series = null;
           newConfig.scrollbar.enabled = false;
       }
   },
   arrayMax(array, comparisonFn){
     var max = array[0], i, ln, item;
      for (i = 0, ln = array.length; i < ln; i++) {
          item = array[i];

          if (comparisonFn) {
              if (comparisonFn(max, item) === -1) {
                  max = item;
              }
          }
          else {
              if (item > max) {
                  max = item;
              }
          }
      }

      return max;
   },
   initYaxis: function (data, config) {
        if (!isArray(data)) return;
        var yList = [];
        var dic = {};
        var count = 0;
        var offset = yAxisOffset;
        for (let i = 0; i < data.length; i++) {
            let uom = data[i].option.uom;
            if (dic[uom]) continue;
            //when no data,not generate yaxis
            if (data[i].data.length < 1) continue;
            let name = uom;
            let sign = count === 0 ? 1 : -1;
            let min = 0, max;
            if (this.yaxisSelector) {
                let yconfig = this.yaxisSelector.getYaxisConfig();
                for (let j = 0; j < yconfig.length; j++) {
                    if (yconfig[j].uom == name) {
                        min = yconfig[j].val[1];
                        max = yconfig[j].val[0];
                        break;
                    }
                }
            }
            yList.push({
                'yname': name,
                showLastLabel: true,
                min: min,
                max: max,
                type: 'linear',
                title: {
                    align: 'high',
                    rotation: 0,
                    y: -15,
                    text: ''
                },
                minRange: 0.1,//must have when values are all the same, make it draw y axis
                labels: {
                    align: count === 0 ? 'right' : 'left',
                    y: 5,
                    x: -6 * sign,
                    formatter: dataLabelFormatter
                },
                offset: yList.length >= 3 ? -10000 : count != 2 ? 0 : offset,
                opposite: (count !== 0)//,
                //gridLineWidth: count == 0 ? 1 : 0//for contour 等高线对齐，要使用此属性
            });
            count++;
            dic[uom] = true;
        }
        if (yList.length === 0) {
            yList.push({});
        }

        if (this.type != 'pie') {
            var yconfig = this.yaxisSelector;
            if (yconfig) yconfig = this.yaxisSelector.getYaxisConfig();
            if (!yconfig) yconfig = [];
            for (let i = 0; i < data.length; ++i) {
                if (data[i].data.length < 1) continue;
                var uom = data[i].option.uom;
                var name = uom;
                var customized = false;
                for (let j = 0; j < yconfig.length; j++) {
                    if (yconfig[j].uom == name) {
                        customized = true;
                        break;
                    }
                }
                if (customized) continue;

                var data1 = data[i] && data[i].data;
                var hasNeg = false;
                for (var j = 0; j < data1.length; ++j) {
                    if (isArray(data1[j])) {
                        if (data1[j][1] && data1[j][1] < 0) {
                            hasNeg = true;
                            break;
                        }
                    }
                    else {
                        if (data1[j] < 0) {
                            hasNeg = true;
                            break;
                        }
                    }
                }
                if (hasNeg) {
                    for (var k = 0; k < yList.length; ++k) {
                        var y = yList[k];
                        if (y.yname == name) {
                            y.min = undefined;
                        }
                    }
                }
            }
        }

        config.yAxis = yList;
    },
    initFlagSeriesData: function (newConfig, convertedData) {
        var item,
            serieObj,
            flagSeries = [],
            alarmSeries = [],
            dmData = this.props.energyRawData,
            t = dmData.TargetEnergyData,
            factory = EnergyCommentFactory;

        var type, subType; //type and subType两个参数决定了是从哪个页面访问的，energy cost carbon unit ratio，前台也能获取，只不过这部分逻辑放到了后台，为add comment使用。
        var xaxisMap;

        for (var i = 0, len = t.length; i < len; i++) {
            item = t[i];
            xaxisMap = {};

            if(false){//not support comment for new version
                // get and push comment flag series
                if (item.EnergyAssociatedData && item.EnergyAssociatedData.Comments && item.EnergyAssociatedData.Comments.length > 0) {
                    serieObj = factory.createCommentSeriesByTargetEnergyDataItem(item, this.props.step, convertedData[i].id, xaxisMap);
                    serieObj.visible = !convertedData[i].graySerie;
                    serieObj.zIndex = 11;
                    flagSeries.push(serieObj);
                }
            }

            if(true){//will check privilidge for alarm
                //get and push alarm flag series
                if (item.EnergyAssociatedData && item.EnergyAssociatedData.AlarmHistories && item.EnergyAssociatedData.AlarmHistories.length > 0) {
                    serieObj = factory.createAlarmSeriesByTargetEnergyDataItem(item, convertedData[i].id, xaxisMap, this.props.step);
                    serieObj.visible = !convertedData[i].graySerie;
                    serieObj.zIndex = 11; //default 10
                    alarmSeries.push(serieObj);
                }
            }

            //set type and subtype for this scope
            if (!isNumber(type)) {
                if (item.EnergyAssociatedData && isNumber(item.EnergyAssociatedData.Type)) {
                    type = this.chartCommentType = item.EnergyAssociatedData.Type;
                    this.chartCommentSubtype = item.EnergyAssociatedData.SubType;
                }
            }
        }
        newConfig.series = newConfig.series.concat(flagSeries);
        newConfig.series = newConfig.series.concat(alarmSeries);
    }
});

module.exports = ChartComponent;
