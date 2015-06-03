'use strict';

import React from 'react';
import assign from 'object-assign';
import Highstock from '../highcharts/Highstock.jsx';
import ChartXAxisSetter from './ChartXAxisSetter.jsx';
import {dateAdd, dateFormat, DataConverter} from '../../util/Util.jsx';

var yAxisOffset = 70;
const DEFAULT_OPTIONS = {
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
                        left = this.options.chart.spacingLeft;
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
                        left = this.options.chart.spacingLeft;
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
                        return dateFormat(new Date(v), 'Y年');
                    }
                    else {
                        return dateFormat(new Date(v), 'Y年m月');
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
        enabled: true,
        layout: 'vertical',
        verticalAlign: 'top',
        y: 60,
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

    getInitialState() {
        return {

        };
    },

    componentWillMount() {
    },
    componentWillReceiveProps(nextProps) {
    	console.log('componentWillReceiveProps', nextProps);
    },
    render () {

      let that = this;
      if(!this.props.energyData) {
          return null;
      }

      return (
              <Highstock ref="highstock" options={that._initChartObj()}></Highstock>
      );
  },
  _initChartObj() {
    var data = this.props.energyData;
    var newConfig = assign({}, DEFAULT_OPTIONS,
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

      var realData = this.convertData(data.Data, newConfig);
      var timeRange = this.initRange(newConfig, realData);
      this.initNavigatorData(newConfig, timeRange, data);

      newConfig.tooltipSidePosition = true;

      return newConfig;

  },
  convertData: function (data, config) {
      var ret = [];
      for (var j = 0; j < data.length; ++j) {
          var item = data[j];
          var n = item.name;
          var isBenchmarkLine = item.dType == 15;
          //if (n.indexOf('<br') < 0) {//hack for multi-timespan compare
          //    n = Ext.String.ellipsis(n, 23, false); //greater than 23 then truncate with ...
          //}
          var s = {
              type: 'line',
              name: n,
              enableDelete: false,
              enableHide: !!!item.disableHide,
              data: item.data,
              option: item.option,
              uid: item.uid,
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


      if (window.toString.call(d) === '[object Array]' && d.length === 0) {
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
          if (window.toString.call(d) === '[object Array]') {
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

               nowBound.setMinutes(endTime.getMinutes(), 0, 0);
               break;
           case 1:
               endTime = new Date(endTime);
               if (endTime.getMinutes() < 30) {
                   endTime = dateAdd(new Date(endTime), 1, 'hours');
               }
               nowBound = dateAdd(nowBound, 1, 'hours');
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

               nowBound.setMinutes(endTime.getMinutes(), 0, 0);
               break;
           case 7:
               endTime = new Date(endTime);
               if (endTime.getMinutes() < 30) {
                   endTime = dateAdd(new Date(endTime), 1, 'hours');
               }
               nowBound = dateAdd(nowBound, 1, 'hours');
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
   }
});

module.exports = ChartComponent;
