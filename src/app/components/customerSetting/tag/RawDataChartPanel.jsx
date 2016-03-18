'use strict';

import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';
import mui from 'material-ui';
import Highstock from '../../highcharts/Highstock.jsx';
import ChartXAxisSetter from '../../energy/ChartXAxisSetter.jsx';
import EnergyCommentFactory from '../../energy/EnergyCommentFactory.jsx';
import ChartCmpStrategyFactor from '../../energy/ChartCmpStrategyFactor.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import { dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon } from '../../../util/Util.jsx';
import ChartStatusStore from '../../../stores/energy/ChartStatusStore.jsx';
let {Dialog, FlatButton, Checkbox} = mui;
let yAxisOffset = 70;
let _chartObj = null;
var dataLabelFormatter = function(format) {
  var f = window.Highcharts.numberFormat;
  var v = Number(this.value);
  var sign = this.value < 0 ? -1 : 1;

  v = Math.abs(v);
  if (v === 0) {
    if (format === false) {
      return this.value;
    } else {
      return v;
    }
  }
  if (v < Math.pow(10, 3)) {
    if (format === false) {
      return v * sign;
    } else {
      return f(v * sign, 2);
    }
  } else if (v < Math.pow(10, 6)) {
    if (format === false) {
      var len = parseInt(v / 1000).toString().length;
      var v1 = v.toString();
      var retV = v1.substring(0, len) + ',' + v1.substring(len);
      if (sign < 0)
        retV = '-' + retV;
      return retV;
    } else {
      return f(v * sign, 0);
    }
  } else if (v < Math.pow(10, 8)) {
    v = f(parseInt(v / Math.pow(10, 3)) * sign, 0) + 'k';
  } else if (v < Math.pow(10, 11)) {
    v = f(parseInt(v / Math.pow(10, 6)) * sign, 0) + 'M';
  } else if (v < Math.pow(10, 14)) {
    v = f(parseInt(v / Math.pow(10, 9)) * sign, 0) + 'G';
  } else if (v < Math.pow(10, 17)) {
    v = f(parseInt(v / Math.pow(10, 12)) * sign, 0) + 'T';
  }
  return v;
};
let defaultConfig = {
  colors: [
    '#cfa9ff', '#11d9db', '#6f7cb3', '#fe8185', '#5edba3', '#ffd697',
    '#ffceb3', '#a4fe95', '#a5f160', '#00a038', '#f7d5ff', '#eca9ff',
    '#a988b1', '#01aefe', '#15b3b1', '#8ccdff', '#fff1a7', '#fde24f',
    '#fdad4f', '#f6693e', '#a73e1d', '#ffa6d4', '#f25aa9', '#fd3266',
    '#e95151', '#dedaff', '#a0a0fe', '#7c99be', '#626286', '#2727a1'
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
    type: 'coloredline',
    panning: false,
    zoomType: 'xy',
    backgroundColor: "#FBFBFB",
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    borderRadius: 0,
    resetZoomButton: false,
    events: {
      load: function() {
        var offset = yAxisOffset;
        for (var i = 0, len = this.yAxis.length; i < len && i < 3; ++i) {
          var y = this.yAxis[i];
          var left,
            top = y.top - 6 - 10;
          if (!y.options.opposite) {
            left = this.options.chart.spacingLeft || 12;
          } else {
            left = y.left + this.plotWidth + 5 + (offset * (i - 1));
          }
          if (!y.yTitle && y.options.yname && y.hasVisibleSeries) {
            var name = y.options.yname;
            var yTitle = this.renderer.text(name, left, top).add();
            y.yTitle = yTitle;
          }

        }
      },
      redraw: function() {
        var offset = yAxisOffset;
        for (var i = 0, len = this.yAxis.length; i < len && i < 3; ++i) {
          var y = this.yAxis[i];
          var title = y.yTitle;
          var left,
            top = y.top - 6 - 10;
          if (!y.options.opposite) {
            left = this.options.chart.spacingLeft || 12;
          } else {
            left = y.left + this.plotWidth + 5 + (offset * (i - 1));
          }
          if (title) {
            title.attr({
              x: left,
              y: top
            });
          } else {
            if (y.options.yname) {
              var name = y.options.yname;
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
            } else {
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
    ordinal: false, //must false for missing data
    type: 'datetime',
    tickPositioner: function(min, max) {
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
    enabled: false,
    margin: 25,
    adaptToUpdatedData: false,
    xAxis: {
      ordinal: false,
      labels: {
        formatter: function() {
          var v = this.value;

          return dateFormat(new Date(v), 'MM/DD');

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
  style: {
    "fontSize": "12px",
    fontFamily: 'Microsoft YaHei'
  },
  // legend: {
  //   deleteAllButtonText: '',
  //   enabled: true,
  //   layout: 'vertical',
  //   verticalAlign: 'top',
  //   y: 40,
  //   x: -25,
  //   useHTML: true,
  //   labelFormatter: function() {
  //     return '<div style="max-width:100px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" title="' + this.name.replace('<br/>', '&#10;') + '">' + this.name + '</div>';
  //   },
  //   itemStyle: {
  //     cursor: 'default',
  //     color: '#3b3b3b',
  //     "fontWeight": "normal"
  //   },
  //   itemHoverStyle: {
  //     cursor: 'pointer',
  //     color: '#000'
  //   },
  //   borderWidth: 0,
  //   margin: 10,
  //   align: 'right',
  //   itemMarginTop: 6,
  //   itemMarginBottom: 6
  // },
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
        radius: 4,
        fillColor: false,
        hover: {
          fillColor: false,
        }
      }
    },
    column: {
      dataGrouping: {
        enabled: false
      },
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
      dataGrouping: {
        enabled: false
      },
      zIndex: 10,
      point: {
        events: {
          click: function(event) {
            var chart = this.series.chart;
            chart.trigger('editComment', {
              event: event,
              point: this
            });
          }
        }
      },
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
    }
  }
};

let RawDataChartPanel = React.createClass({
  propTypes: {
    //onDeleteButtonClick: React.PropTypes.func,
    //onDeleteAllButtonClick: React.PropTypes.func,
    afterChartCreated: React.PropTypes.func,
    energyData: React.PropTypes.object,
    energyRawData: React.PropTypes.object,
    step: React.PropTypes.number,
    startTime: React.PropTypes.string,
    endTime: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      chartType: 'line',
      bizType: 'Energy',
      energyType: 'Energy',
      chartTooltipHasTotal: false
    };
  },
  componentWillMount() {
    this.initDefaultConfig();
  },
  componentDidMount: function() {
    TagStore.addListToPointChangeListener(this._onListToPointChanged);
  },

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.range && nextProps.range !== this.props.range) {
  //     this.state.chartCmpStrategy.onChangeRangeFn(nextProps.range, this);
  //   }
  //   if (nextProps.order && nextProps.order !== this.props.order) {
  //     this.state.chartCmpStrategy.onChangeOrderFn(nextProps.order, this);
  //   }
  // },
  getInitialState() {
    let chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyTrendComponent');
    var obj = chartCmpStrategy.getInitialStateFn(this);
    var state = {
      chartCmpStrategy: chartCmpStrategy
    };
    assign(state, obj);
    return state;
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return !(this.props.energyRawData.equals(nextProps.energyRawData));
  },
  componentWillUnmount: function() {
    TagStore.removeListToPointChangeListener(this._onListToPointChanged);
  },
  _onListToPointChanged: function(nId) {
    var originalSeries = _chartObj.series[0].data;
    originalSeries.forEach((data, index) => {
      if (index != nId && data.selected === true) {
        data.select(false)
      }
      if (index === nId) {
        data.select(true)
      }
    })
  },
  getDataLabelFormatterFn() {
    return dataLabelFormatter;
  },
  initDefaultConfig: function() {
    let cap = function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    };
    var t = ['millisecond', 'second', 'minute', 'hour', 'day', 'dayhour', 'week', 'month', 'fullmonth', 'year'],
      c = defaultConfig,
      x = c.xAxis,
      f = I18N.DateTimeFormat.HighFormat;

    t.forEach(function(n) {
      x.dateTimeLabelFormats[n] = (f[cap(n)]);
    });

    c.chart.cancelChartContainerclickBubble = true;
  },
  render() {
    let that = this;
    if (!this.props.energyData) {
      return null;
    }
    // var ignoreObj = {
    //   _onIgnoreDialogSubmit: this._onIgnoreDialogSubmit,
    //   _onIgnoreDialogCancel: this._onIgnoreDialogCancel,
    //   ref: 'ignoreDialogWindow'
    // };
    // var dialog = <AlarmIgnoreWindow {...ignoreObj} ></AlarmIgnoreWindow>;

    let highstockEvents = {
      afterChartCreated: that._afterChartCreated,
    };
    return <div style={{
        display: 'flex',
        flex: 1,
        marginLeft: '10px',
        marginTop: '20px'
      }}>
          <Highstock ref="highstock" options={that._initChartObj()} {...highstockEvents}></Highstock>
       </div>;
  },
  _afterChartCreated(chartObj) {
    _chartObj = chartObj;
    if (this.props.afterChartCreated) {
      this.props.afterChartCreated(chartObj);
    }
  },
  _initChartObj() {
    var that = this;
    var data = this.props.energyData.toJS();
    var cloneConfig = _.cloneDeep(defaultConfig);
    var newConfig = assign({}, cloneConfig,
      {
        animation: true,
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
    //newConfig.navigator.step = this.props.step;

    this.mergeConfig(newConfig);

    this.initYaxis(data.Data, newConfig);

    var realData = this.convertData(data.Data, newConfig);
    var timeRange = this.initRange(newConfig, realData);
    //this.initNavigatorData(newConfig, timeRange, data);
    if (this.props.chartType === "line" || this.props.chartType === "column") {
      this.initFlagSeriesData(newConfig, realData);
    }


    this.initSeriesVisibility(newConfig.series);

    ChartStatusStore.assignStatus(newConfig);

    newConfig.tooltipSidePosition = true;
    if (this.props.chartTooltipHasTotal) {
      newConfig.chartTooltipHasTotal = true;
    }
    return newConfig;

  },
  initSeriesVisibility: function(series) {
    if (series && series[0]) {
      if (series[0].type === 'pie') {
        series = series[0].data;
      }
    }
    var serie;
    if (series && series.length > 0) {
      for (var i = 0; i < series.length; i++) {
        serie = series[i];
        if (!!serie.graySerie) {
          serie.visible = false;
        } else {
          serie.visible = true;
        }
      }
    }
  },
  mergeConfig: function(defaultConfig) {
    this.state.chartCmpStrategy.mergeConfigFn(defaultConfig, this);
  },
  convertData: function(data, config) {
    return this.state.chartCmpStrategy.convertDataFn(data, config, this);
  },
  convertSingleItem: function(item, s) {
    this.state.chartCmpStrategy.convertSingleItemFn(item, s, this);
  },
  initRange: function(newConfig, realData) {
    return this.state.chartCmpStrategy.initRangeFn(newConfig, realData, this);
  },
  initNavigatorData: function(newConfig, timeRange, data) {
    this.state.chartCmpStrategy.initNavigatorDataFn(newConfig, timeRange, data, this);
  },
  arrayMax(array, comparisonFn) {
    var max = array[0],
      i,
      ln,
      item;
    for (i = 0, ln = array.length; i < ln; i++) {
      item = array[i];
      if (comparisonFn) {
        if (comparisonFn(max, item) === -1) {
          max = item;
        }
      } else {
        if (item > max) {
          max = item;
        }
      }
    }
    return max;
  },
  makePosition: function(list) {
    var listItem,
      newList = [];
    var pos = 1,
      gap = 0;
    for (var i = 0; i < list.length; ++i) {
      listItem = list[i];
      if (i !== 0) {
        if (listItem.val == list[i - 1].val) {
          gap++;
        } else {
          pos++;
          if (gap !== 0) {
            pos += gap;
            gap = 0;
          }
        }
      }
      newList.push({
        name: listItem.name,
        pos: pos,
        val: listItem.val
      });
    }
    return newList;
  },
  initYaxis: function(data, config) {
    this.state.chartCmpStrategy.initYaxisFn(data, config, yAxisOffset, this);
  },
  initFlagSeriesData: function(newConfig, convertedData) {
    var item,
      serieObj,
      flagSeries = [],
      alarmSeries = [],
      dmData = this.props.energyRawData.toJS(),
      t = dmData.TargetEnergyData,
      factory = EnergyCommentFactory,
      that = this;

    var type,
      subType; //type and subType两个参数决定了是从哪个页面访问的，energy cost carbon unit ratio，前台也能获取，只不过这部分逻辑放到了后台，为add comment使用。
    var xaxisMap;

    for (var i = 0, len = t.length; i < len; i++) {
      item = t[i];
      xaxisMap = {};
      //set type and subtype for this scope
      if (!isNumber(type)) {
        if (item.EnergyAssociatedData && isNumber(item.EnergyAssociatedData.Type)) {
          type = this.chartCommentType = item.EnergyAssociatedData.Type;
          this.chartCommentSubtype = item.EnergyAssociatedData.SubType;
        }
      }
    }
    let data = [];
    newConfig.series[0].data.forEach((item, index) => {
      let pItem,
        color;

      if (index > 0 && index < t[0].EnergyData.length) {
        if (t[0].EnergyData[index - 1].DataQuality === 9) {
          color = '#f46a58'
        } else {
          if (t[0].EnergyData[index - 1].DataQuality === 6 || t[0].EnergyData[index - 1].DataQuality === 8) {
            color = '#cfa9ff'
          } else {
            color = '#11d9db'
          }
        }
        pItem = {
          x: item[0],
          y: item[1],
          fillColor: color,
          color: color,
          events: {
            click: () => {
              TagAction.selectPointToList(index - 1);
              that._onListToPointChanged(index - 1);
            }
          },
          marker: {
            color: color,
            fillColor: color,
            states: {
              hover: {
                marker: {
                  fillColor: color
                }
              }
            }
          }
        }
        if (index < t[0].EnergyData.length - 1) {
          if (t[0].EnergyData[index - 1].DataQuality === 9 || t[0].EnergyData[index].DataQuality === 9) {
            pItem.segmentColor = '#f46a58';
          } else {
            if (t[0].EnergyData[index - 1].DataQuality === 6 || t[0].EnergyData[index - 1].DataQuality === 8 || t[0].EnergyData[index].DataQuality === 6 || t[0].EnergyData[index].DataQuality === 8) {
              pItem.segmentColor = '#cfa9ff';
            } else {
              pItem.segmentColor = '#11d9db';
            }
          }
        }

        data.push(pItem)
      }




    });
    newConfig.series[0].data = data;
    newConfig.series[0].type = 'coloredline';
    newConfig.series[0].dType = null;
    newConfig.series = newConfig.series.concat(flagSeries);
    newConfig.series = newConfig.series.concat(alarmSeries);
  }
});

module.exports = RawDataChartPanel;
