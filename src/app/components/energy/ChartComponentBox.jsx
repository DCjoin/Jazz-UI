'use strict';

import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';
import mui from 'material-ui';
import Highstock from '../highcharts/Highstock.jsx';
import ChartXAxisSetter from './ChartXAxisSetter.jsx';
import AlarmIgnoreWindow from './AlarmIgnoreWindow.jsx';
import EnergyCommentFactory from './EnergyCommentFactory.jsx';
import AlarmAction from '../../actions/AlarmAction.jsx';
import { dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon } from '../../util/Util.jsx';
import ChartCmpStrategyFactor from './ChartCmpStrategyFactor.jsx';
import ChartStatusStore from '../../stores/energy/ChartStatusStore.jsx';
import ChartStatusAction from '../../actions/ChartStatusAction.jsx';
import CurrentUserStore from '../../stores/CurrentUserStore.jsx';

let {Dialog, FlatButton, Checkbox} = mui;
let yAxisOffset = 70;

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
    '#3399cc', '#99cc66', '#996699', '#cccc33', '#663366', '#cc6666',
    '#6699cc', '#cc9999', '#cc3399', '#cccc00', '#cc6633', '#336666',
    '#669933', '#6699ff', '#66cccc', '#3399ff', '#66cc66', '#996699',
    '#999966', '#669999', '#996666', '#666699', '#669966', '#cc3366',
    '#99cc00', '#cc9933', '#666666', '#99cc99', '#ffcc66', '#336699'
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
    enabled: true,
    margin: 25,
    adaptToUpdatedData: false,
    xAxis: {
      ordinal: false,
      labels: {
        formatter: function() {
          var v = this.value;
          var chart = this.chart;
          var step = chart.options.navigator.step;
          if (step == 4) {
            return dateFormat(new Date(v), 'YYYY');
          } else {
            return dateFormat(new Date(v), 'YYYY/MM');
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
  style: {
    "fontSize": "12px",
    fontFamily: 'Microsoft YaHei'
  },
  legend: {
    deleteAllButtonText: '',
    enabled: true,
    layout: 'vertical',
    verticalAlign: 'top',
    y: 40,
    x: -25,
    useHTML: true,
    labelFormatter: function() {
      return '<div style="max-width:100px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" title="' + this.name.replace('<br/>', '&#10;') + '">' + this.name + '</div>';
    },
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

let ChartComponentBox = React.createClass({
  propTypes: {
    onDeleteButtonClick: React.PropTypes.func,
    onDeleteAllButtonClick: React.PropTypes.func,
    afterChartCreated: React.PropTypes.func,
    energyData: React.PropTypes.object,
    energyRawData: React.PropTypes.object,
    step: React.PropTypes.number,
    startTime: React.PropTypes.string,
    endTime: React.PropTypes.string,
    chartType: React.PropTypes.string,
    chartTooltipHasTotal: React.PropTypes.bool
  },
  getDefaultProps() {
    return {
      chartType: 'line',
      chartTooltipHasTotal: false
    };
  },
  componentWillMount() {
    this.initDefaultConfig();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.range && nextProps.range !== this.props.range) {
      this.state.chartCmpStrategy.onChangeRangeFn(nextProps.range, this);
    }
    if (nextProps.order && nextProps.order !== this.props.order) {
      this.state.chartCmpStrategy.onChangeOrderFn(nextProps.order, this);
    }
  },
  getInitialState() {
    let bizType = this.props.bizType,
      energyType = this.props.energyType,
      chartType = this.props.chartType;

    let chartCmpStrategy;
    switch (bizType) {
      case 'Energy':
        if (energyType === 'Energy') {
          if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
            chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyTrendComponent');
          } else if (chartType === 'pie') {
            chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyPieComponent');
          }
        } else if (energyType === 'Carbon') {
          if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
            chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyTrendComponent');
          } else if (chartType === 'pie') {
            chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyPieComponent');
          }
        } else if (energyType === 'Cost') {
          if (chartType === 'line' || chartType === 'column' || chartType === 'stack') {
            chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyTrendComponent');
          } else if (chartType === 'pie') {
            chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyPieComponent');
          }
        }
        break;
      case 'Unit':
        chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('UnitTrendComponent');
        break;
      case 'Ratio':
        chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('EnergyTrendComponent');
        break;
      case 'Label':

        break;
      case 'Rank':
        chartCmpStrategy = ChartCmpStrategyFactor.getStrategyByChartType('RankTrendComponent');
        break;

    }
    var obj = chartCmpStrategy.getInitialStateFn(this);
    var state = {
      chartCmpStrategy: chartCmpStrategy
    };
    assign(state, obj);
    return state;
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return !(this.props.energyData.equals(nextProps.energyData) && this.props.chartType === nextProps.chartType);
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
  _onIgnoreDialogSubmit() {
    let isBatchIgnore = this.refs.ignoreDialogWindow.refs.batchIgnore.isChecked();
    let point = this.selectedIgnorePoint,
      factory = EnergyCommentFactory,
      ids,
      ignorePoints = [];
    if (isBatchIgnore) {
      let step = point.series.options.option.step;
      ids = factory.getContinuousPointids(point, ignorePoints, step);
    } else {
      ids = point.alarmId;
      ignorePoints.push(point);
    }
    AlarmAction.ignoreAlarm(ids, isBatchIgnore, ignorePoints);
    this.refs.ignoreDialogWindow.dismiss();
  },
  _onIgnoreDialogCancel() {
    this.refs.ignoreDialogWindow.dismiss();
  },
  render() {
    let that = this;
    if (!this.props.energyData) {
      return null;
    }
    var ignoreObj = {
      _onIgnoreDialogSubmit: this._onIgnoreDialogSubmit,
      _onIgnoreDialogCancel: this._onIgnoreDialogCancel,
      ref: 'ignoreDialogWindow'
    };
    var dialog = <AlarmIgnoreWindow {...ignoreObj} ></AlarmIgnoreWindow>;

    let highstockEvents = {
      onDeleteButtonClick: that._onDeleteButtonClick,
      onDeleteAllButtonClick: that._onDeleteAllButtonClick,
      onIgnoreAlarmEvent: that.onIgnoreAlarmEvent,
      afterChartCreated: that._afterChartCreated,
      onLegendItemClick: that._onLegendItemClick,
      onSwitchChartTypeButtonClick: that._onSwitchChartTypeButtonClick
    };
    return <div style={{
        display: 'flex',
        flex: 1,
        marginLeft: '10px',
        marginTop: '20px'
      }}>
          <Highstock ref="highstock" options={that._initChartObj()} {...highstockEvents}></Highstock>
          {dialog}
       </div>;
  },
  _onLegendItemClick(obj) {
    var event = obj.event,
      seriesItem = obj.seriesItem,
      enableHide = obj.enableHide,
      flagSerie,
      factory = EnergyCommentFactory;

    if (this.props.chartType === 'pie' || this.props.chartType === 'stack') {
      let options = seriesItem.options;
      ChartStatusAction.modifySingleStatus(options.id, 'IsDisplay', seriesItem.visible);
      return;
    }

    if (enableHide) {
      flagSerie = factory.getFlagSeriesByOnSeriesId(seriesItem.options.id, seriesItem.chart.series, 'comment');
      if (flagSerie) {
        flagSerie.setVisible();
      }

      flagSerie = factory.getFlagSeriesByOnSeriesId(seriesItem.options.id, seriesItem.chart.series, 'alarm');
      if (flagSerie) {
        flagSerie.setVisible();
      }
      let options = seriesItem.options;
      ChartStatusAction.modifySingleStatus(options.id, 'IsDisplay', seriesItem.visible);
    //this.hideOrDestroyOtherCommentPanel(true);//隐藏所有的comment panel
    }
  },
  _onSwitchChartTypeButtonClick(nextType, seriesItem) {
    console.log(nextType, seriesItem);
    ChartStatusAction.modifySingleStatus(seriesItem.options.id, 'ChartType', nextType);
  },
  _afterChartCreated(chartObj) {
    if (this.props.afterChartCreated) {
      this.props.afterChartCreated(chartObj);
    }
  },
  _onDeleteButtonClick(obj) {
    if (this.props.onDeleteButtonClick) {
      this.props.onDeleteButtonClick(obj);
    }
  },
  _onDeleteAllButtonClick() {
    if (this.props.onDeleteAllButtonClick) {
      this.props.onDeleteAllButtonClick();
    }
  },
  onIgnoreAlarmEvent(obj) {
    let point = obj.point;
    this.refs.ignoreDialogWindow.show();
    this.selectedIgnorePoint = point;

    return false;
  },
  _initChartObj() {
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
    newConfig.navigator.step = this.props.step;

    this.mergeConfig(newConfig);

    this.initYaxis(data.Data, newConfig);

    var realData = this.convertData(data.Data, newConfig);
    var timeRange = this.initRange(newConfig, realData);
    this.initNavigatorData(newConfig, timeRange, data);
    if (this.props.chartType == "line" || this.props.chartType == "column") {
      this.initFlagSeriesData(newConfig, realData);
    }

    if (this.state.chartCmpStrategy.getLegendListFn) {
      this.state.chartCmpStrategy.getLegendListFn(newConfig);
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
    var max = array[0], i, ln, item;
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
      dmData = this.props.energyRawData,
      t = dmData.TargetEnergyData,
      factory = EnergyCommentFactory;

    var type, subType; //type and subType两个参数决定了是从哪个页面访问的，energy cost carbon unit ratio，前台也能获取，只不过这部分逻辑放到了后台，为add comment使用。
    var xaxisMap;

    for (var i = 0, len = t.length; i < len; i++) {
      item = t[i];
      xaxisMap = {};

      if (false) { //not support comment for new version
        // get and push comment flag series
        if (item.EnergyAssociatedData && item.EnergyAssociatedData.Comments && item.EnergyAssociatedData.Comments.length > 0) {
          serieObj = factory.createCommentSeriesByTargetEnergyDataItem(item, this.props.step, convertedData[i].id, xaxisMap);
          serieObj.option.step = item.Target.Step;
          serieObj.visible = !convertedData[i].graySerie;
          serieObj.zIndex = 11;
          flagSeries.push(serieObj);
        }
      }
      if (CurrentUserStore.getCurrentPrivilege().indexOf('1221')) { //will check privilidge for alarm
        //get and push alarm flag series
        if (item.EnergyAssociatedData && item.EnergyAssociatedData.AlarmHistories && item.EnergyAssociatedData.AlarmHistories.length > 0) {
          var index = null;
          var indexData = null;
          for (var j = 0; j < convertedData.length; j++) {
            if (convertedData[j].originalName == item.Target.Name) {
              index = convertedData[j].id;
              indexData = convertedData[j];
              break;
            }
          }
          if (index !== null) {
            serieObj = factory.createAlarmSeriesByTargetEnergyDataItem(item, index, xaxisMap, item.Target.Step);
            serieObj.visible = !indexData.graySerie;
            serieObj.zIndex = 11; //default 10
            serieObj.option.step = item.Target.Step;
            alarmSeries.push(serieObj);
          }
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

module.exports = ChartComponentBox;
