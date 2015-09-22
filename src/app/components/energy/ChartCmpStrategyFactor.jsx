'use strict';
import React from "react";
import assign from "object-assign";
import _ from 'lodash';
import CommonFuns from '../../util/Util.jsx';

let {dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon} = CommonFuns;

let tooltipPattern = '<span style="color:{0}">{1}: <b>{2}{3}</b></span><br/>';
let dataLabelFormatter = function(format) {
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

let ChartCmpStrategyFactor = {
  defaultStrategy: {
    convertDataFn: 'convertData',
    convertSingleItemFn: 'convertSingleItem',
    initNavigatorDataFn: 'initNavigatorData',
    initRangeFn: 'initRange'
  },
  strategyConfiguration: {
    EnergyTrendComponent: {
      convertDataFn: 'convertData',
      convertSingleItemFn: 'convertSingleItem',
      mergeConfigFn: 'energyChartCmpMergeConfig',
      initYaxisFn: 'initYaxis',
      initNavigatorDataFn: 'initNavigatorData',
      getInitialStateFn: 'empty',
      getLegendListFn: 'getEnergyLegendList'
    },
    UnitTrendComponent: {
      convertDataFn: 'convertData',
      convertSingleItemFn: 'convertSingleItem',
      mergeConfigFn: 'energyChartCmpMergeConfig',
      initYaxisFn: 'initYaxis',
      initNavigatorDataFn: 'initNavigatorData',
      getInitialStateFn: 'empty',
      getLegendListFn: 'getUnitLegendList'
    },
    RankTrendComponent: {
      mergeConfigFn: 'rankChartCmpMergeConfig',
      convertDataFn: 'rankConvertData',
      getInitialStateFn: 'getRankInitialState',
      onChangeRangeFn: 'onChangeRange',
      onChangeOrderFn: 'onChangeOrder',
      initNavigatorDataFn: 'empty',
      initRangeFn: 'empty',
      initYaxisFn: 'initYaxis'
    },
    EnergyPieComponent: {
      mergeConfigFn: 'pieChartCmpMergeConfig',
      convertDataFn: 'pieConvertData',
      convertSingleItemFn: 'pieConvertSingleItem',
      initYaxisFn: 'empty',
      initRangeFn: 'pieInitRange',
      initNavigatorDataFn: 'pieInitNavigatorData',
      getInitialStateFn: 'empty'
    }
  },
  getLegendListFnStrategy: {
    getEnergyLegendList(config) {
      var legendList = [];
      legendList = ['line', 'column', 'stacking'];
      config.stackByCommodity = true;
      config.legendSwitchList = legendList;
    },
    getUnitLegendList(config) {
      var legendList = [];
      legendList = ['line', 'column'];
      config.stackByCommodity = true;
      config.legendSwitchList = legendList;
    }
  },
  getInitialStateFnStrategy: {
    empty() {},
    getRankInitialState(cmpBox) {
      let state = {
        order: cmpBox.props.order,
        range: cmpBox.props.range,
        minPosition: 0
      };
      return state;
    }
  },
  onChangeRangeFnStrategy: {
    onChangeRange(range, cmpBox) {
      var rangeWidth = range - 1;
      var chartObj = cmpBox.refs.highstock._paper;
      if (!chartObj) {
        cmpBox.setState({
          range: range
        });
        return;
      }
      var oldRange = cmpBox.props.range;
      var list = chartObj.series[0].options.option.list;

      if (list.length <= 3) return;

      var dataMax = list.length - 1;
      cmpBox.setState({
        range: range
      });
      var min = cmpBox.state.minPosition,
        max = 0;
      if (range == 1000) {
        min = 0;
        max = dataMax;
      } else {
        if (oldRange == 1000) {
          min = 0;
          max = rangeWidth;
          if (max > dataMax) {
            max = dataMax;
          }
        } else {
          max = cmpBox.state.minPosition + rangeWidth;
          if (max > dataMax) {
            min = min - (max - dataMax);
            if (min < 0)
              min = 0;
            max = dataMax;
          }
        }
      }
      cmpBox.setState({
        maxPosition: max
      });
      chartObj.xAxis[0].setExtremes(min, max, true, true, {
        changeRange: true
      });
    }
  },
  onChangeOrderFnStrategy: {
    onChangeOrder(order, cmpBox) {
      var chartObj = cmpBox.refs.highstock._paper;
      if (!chartObj) {
        cmpBox.setState({
          order: order
        });
        return;
      }
      var series = chartObj.series[0];
      if (!series) return;
      var list = series.options.option.list;
      var data = [];
      for (var i = 0; i < list.length; ++i) {
        data.unshift(list[i].val);
      }
      list.reverse();
      cmpBox.setState({
        order: order
      });
      var config = {
        xAxis: {}
      };

      series.options.option.list = cmpBox.makePosition(list);
      //don't redraw
      chartObj.series[0].setData(data, false);
      //redraw with animiation
      var range;
      if (cmpBox.state.range === 1000) {
        range = data.length - 1;
      }

      if (list.length < cmpBox.state.range) {
        if (list.length > 1) {
          range = list.length - 1;
        } else {
          range = 1;
        }
      } else {
        range = cmpBox.state.range - 1;
      }
      chartObj.xAxis[0].setExtremes(0, range, true, true);
    }
  },
  initNavigatorDataFnStrategy: {
    empty: function() {},
    initNavigatorData(newConfig, timeRange, data, cmpBox) {
      var startTime = timeRange[0],
        endTime = timeRange[1],
        nowBound = timeRange[2];

      if (data.Navigator) {
        var navData = data.Navigator,
          numStartTime = startTime.getTime(),
          numEndTime = endTime.getTime(),
          navStart = navData[0][0],
          navShouldBeStartAt = numStartTime,
          navShouldBeEndAt = numEndTime;

        for (var i = 0; i < newConfig.series.length; i++) {
          var s = newConfig.series[i];
          if (!s.data || s.data.length === 0) continue;
          var sMin = s.data[0][0],
            sMax = s.data[s.data.length - 1][0];
          if (sMin < navShouldBeStartAt)
            navShouldBeStartAt = sMin;
          if (sMax > navShouldBeEndAt)
            navShouldBeEndAt = sMax;
        }
        navShouldBeEndAt = cmpBox.arrayMax([navShouldBeEndAt, new Date(), DataConverter.JsonToDateTime(cmpBox.props.endTime)]);

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
        newConfig.navigator.series = {
          data: navData,
          dataGrouping: {
            enabled: false
          }
        };
        newConfig.navigator.enabled = true;
        newConfig.scrollbar.enabled = true;

        if (newConfig.series.length > 0) {
          if (newConfig.series[0].data.length === 0) {
            newConfig.series[0].data = [[numStartTime, null], [numEndTime, null]];
          } else {
          }
        }
      } else {
        newConfig.navigator.enabled = false;
        newConfig.navigator.series = null;
        newConfig.scrollbar.enabled = false;
      }
    },
    pieInitNavigatorData(newConfig, timeRange, data) {
      newConfig.navigator.enabled = false;
      newConfig.navigator.series = null;
      newConfig.scrollbar.enabled = false;
    }
  },
  initRangeFnStrategy: {
    empty: function() {},
    initRange(newConfig, realData, cmpBox) {
      let converter = DataConverter,
        j2d = converter.JsonToDateTime,
        endTime = j2d(cmpBox.props.endTime, true),
        startTime = j2d(cmpBox.props.startTime, true),
        step = cmpBox.props.step || 2;

      newConfig.series = realData;
      if (realData && realData.length > 1) {
        cmpBox.navCache = true;
        newConfig.scrollbar.liveRedraw = true;
      } else {
        cmpBox.navCache = true;
      }
      if (step === 1 || step === 0) {
        cmpBox.navCache = false;
        newConfig.scrollbar.liveRedraw = false;
      }

      newConfig.xAxis.min = startTime;
      var nowBound = new Date();
      nowBound.setMinutes(0, 0, 0);
      //#2488
      switch (step) {
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
          if (startTime.getHours() !== 0 && startTime.getHours() <= 12) {
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
          } else {
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
        case 8:
        case 9:
        case 10:
        case 11:
        case 12: endTime = new Date(endTime);
          if (endTime.getHours() > 0 && endTime.getHours() < 12) {
            endTime = dateAdd(new Date(endTime), 1, 'days');
          }
          startTime = new Date(startTime);
          if (startTime.getHours() !== 0 && startTime.getHours() <= 12) {
            startTime.setHours(13);
            newConfig.xAxis.min = startTime.getTime();
          }
          nowBound.setHours(0);
          nowBound = dateAdd(nowBound, 1, 'days');
          break;
      }
      newConfig.xAxis.max = endTime.getTime();

      return [startTime, endTime, nowBound];
    },
    pieInitRange(newConfig, realData, cmpBox) {
      newConfig.series = realData;
    }
  },
  initYaxisFnStrategy: {
    empty: function() {},
    initYaxis(data, config, yAxisOffset, cmpBox) {
      if (!isArray(data)) return;
      var yList = [],
        dic = {},
        count = 0,
        offset = yAxisOffset;

      for (let i = 0; i < data.length; i++) {
        let uom = data[i].option.uom;
        if (dic[uom]) continue;
        //when no data,not generate yaxis
        if (data[i].data.length < 1) continue;
        let name = uom;
        let sign = count === 0 ? 1 : -1;
        let min = 0, max;
        if (cmpBox.props.getYaxisConfig && cmpBox.props.getYaxisConfig()) {
          let yconfig = cmpBox.props.getYaxisConfig();
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
          minRange: 0.1, //must have when values are all the same, make it draw y axis
          labels: {
            align: count === 0 ? 'right' : 'left',
            y: 5,
            x: -6 * sign,
            formatter: dataLabelFormatter
          },
          offset: yList.length >= 3 ? -10000 : count != 2 ? 0 : offset,
          opposite: (count !== 0) //,
        //gridLineWidth: count == 0 ? 1 : 0//for contour 等高线对齐，要使用此属性
        });
        count++;
        dic[uom] = true;
      }
      if (yList.length === 0) {
        yList.push({});
      }
      if (cmpBox.type != 'pie') {
        var yconfig = cmpBox.yaxisSelector;
        if (yconfig)
          yconfig = cmpBox.yaxisSelector.getYaxisConfig();
        if (!yconfig)
          yconfig = [];
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
            } else {
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
    }
  },
  mergeConfigFnStrategy: {
    energyChartCmpMergeConfig(defaultConfig) {
      var commonTooltipFormatter = function() {
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
            color, name, dataLabelFormatter.call({
              value: point.y
            }, false), uom);
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
        total = dataLabelFormatter.call({
          value: total
        }, false);
        if (this.points.length > 1 && this.points[0].series.chart.userOptions.chartTooltipHasTotal) {
          str += '总计：<b>' + total + uom + '</b>';
        }
        return str;
      };

      defaultConfig.tooltip.formatter = commonTooltipFormatter;
    },
    rankChartCmpMergeConfig(defaultConfig, cmpBox) {
      var tooltipFormatter = function() {
        var series = this.points[0].series;
        var option = series.options.option;
        var uom = option.uom;
        var list = option.list;
        var total = list.length;
        if (this.x > total - 1) return '';
        var tooltip = I18N.EM.Rank.RankTooltip; //排名:{0}/{1}
        var str = tooltip.replace('{0}', list[this.x].pos).replace('{1}', total);
        str += "<br/>";
        str += list[this.x].name + '-';
        var val = dataLabelFormatter.call({
          value: list[this.x].val
        }, false);
        str += series.options.option.commodity + ':' + val;
        str += uom;
        return str;
      };
      var xAxisLabelFormatter = function() {
        var v = this.value,
          chart = this.chart;
        var series = chart.series[0];
        var list = series.options.option.list;
        if (list.length - 1 < v) return '';
        var name = list[v].name;

        return JazzCommon.TrimText(name, 4, 'left');
      };
      var xAxisTickPositioner = function(min, max) {
        var width = this.width,
          serieses = this.series,
          series,
          ret = [];
        if (!!serieses || serieses.length === 0) return;
        series = serieses[0];
        ret.info = {
          higherRanks: {}
        };
        var tpp = (max - min) / width;

        var xData = series.xData;
        var yData = series.yData;
        var firstData,
          i = 0;

        while (i < xData.length) {
          if (yData[i] !== null) {
            firstData = xData[i];
            break;
          }
          ++i;
        }

        var count = 1;
        var j = i;
        while ((xData[j + count] - xData[j]) / tpp < 40) {
          count++;
        }
        j = i;
        while (j < xData.length) {
          //when use all data, data will be greater than xAxis
          if (xData[j] >= min && xData[j] <= max) {
            ret.push(xData[j]);
            ret.info.higherRanks[xData[j]] = '';
          }
          j += count;
        }
        return ret;
      };
      defaultConfig.navigator.enabled = false;
      defaultConfig.legend.enabled = false;
      defaultConfig.chart.spacingRight = 30;
      defaultConfig.xAxis.labels = {
        rotation: -45,
        align: 'center',
        y: 20,
        overflow: undefined,
        //x: -5,

        formatter: xAxisLabelFormatter
      };
      defaultConfig.xAxis.showFirstLabel = true;
      defaultConfig.xAxis.showLastLabel = true;
      defaultConfig.xAxis.tickPositioner = xAxisTickPositioner;
      defaultConfig.tooltip.formatter = tooltipFormatter;
      var range = cmpBox.state.range - 1;
      var order = cmpBox.state.order;
      defaultConfig.xAxis.min = cmpBox.state.minPosition;
      defaultConfig.xAxis.max = cmpBox.state.minPosition + range;
      defaultConfig.xAxis.range = range;
    },
    pieChartCmpMergeConfig(defaultConfig) {
      defaultConfig.tooltip.formatter = function() {
        var series = this.point.series,
          color = this.point.color,
          op = this.point.options,
          uom = op.option.uom,
          name = op.name;

        var y = this.y;
        if (y === null || y === 'null')
          y = 0;

        var str = '';
        // var components = Ext.ComponentQuery.query('piechartcomponent');
        // if (components.length > 0) {
        //     var com = components[0];
        //     //多时间段比较时，需要加上tagname
        //     if (com.reader.xtype == 'energymultitimespanpiereader') {
        //         var tagName = com.param.options[0]['Name'];
        //         str = tagName + '<br/>';
        //         var names = name.split('<br/>');
        //         //name 格式"2014-04-27 06:00<br/>2014-05-04 11:00" highchart会将颜色根据br分开，即只有第一行有颜色，第二行没颜色。所以要分开对待
        //         return (str + Ext.String.format(
        //            '<span style="color:{0}">{1}</span><br/><span style="color:{0}">{2}:</span> <b>{3}{4}</b><br/>',
        //            color, names[0], names[1], cmp.dataLabelFormatter.call({ value: y }, false), uom));
        //     }
        // }

        return (str + I18N.format(tooltipPattern, color, name, dataLabelFormatter.call({
            value: y
          }, false), uom));
      };

      defaultConfig.tooltip.shared = false;
      defaultConfig.tooltip.crosshairs = false;

      defaultConfig.plotOptions.pie = {
        allowPointSelect: true,
        shadow: false,
        dataLabels: {
          enabled: true,
          align: 'left',
          formatter: function() {
            var s = this.point.options.option.uom;
            return dataLabelFormatter.call({
                value: this.y
              }) + s + ', ' + toFixed(this.percentage, 1) + '%';
          }
        },
        showInLegend: true
      };
    }
  },
  convertDataFnStrategy: {
    convertData(data, config, cmpBox) {
      var ret = [];
      for (var j = 0; j < data.length; ++j) {
        var item = data[j];
        var n = item.name;
        var isBenchmarkLine = item.dType == 15;
        if (n.indexOf('<br') < 0) { //hack for multi-timespan compare
          n = JazzCommon.GetArialStr(n, 23); //greater than 23 then truncate with ...
        }
        let enableDelete = true;
        if ((typeof item.enableDelete) === 'boolean') {
          enableDelete = item.enableDelete;
        } else if ((typeof item.disableDelete) === 'boolean') {
          enableDelete = !item.disableDelete;
        } else if (item.dType == 12 || item.dType == 13 || item.dType == 14 || item.dType == 15) {
          enableDelete = false;
        }
        var s = {
          name: n,
          enableDelete: enableDelete,
          enableHide: !!!item.disableHide,
          data: item.data,
          option: item.option,
          uid: item.uid,
          dType: item.dType,
          id: 'Id' + item.uid + 'Type' + item.dType,
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
            enabled: true,
            radius: 6,
            lineWidth: 2,
            lineColor: 'white',
            states: {
              hover: {
                enabled: true,
                radius: 8,
                lineWidth: 2,
                lineColor: 'white'
              }
            }
          };

          s.shadow = {
            color: 'grey',
            width: 3,
            offsetX: 0,
            offsetY: 3
          };
          s.type = 'line';
        } else if (cmpBox.props.chartType == 'stack') {
          s.type = 'column';
          s.stacking = 'normal';
          s.stack = item.option.uomId;
        } else {
          s.type = cmpBox.props.chartType;
          s.stacking = undefined;
        }
        cmpBox.state.chartCmpStrategy.convertSingleItemFn(item, s, cmpBox);
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
    rankConvertData(data, config, cmpBox) {
      var item = data[0];
      var s = {
        type: cmpBox.props.chartType,
        enableDelete: false,
        enableHide: false,
        data: item.data,
        seriesKey: item.seriesKey,
        uid: 'ranking'
      };
      var list = item.option.list;


      if (cmpBox.props.order != 1) { //default is asc
        s.data.reverse();
        list.reverse();
      }



      s.option = {
        list: cmpBox.makePosition(list),
        commodity: item.option.commodity,
        uom: item.option.uom
      };

      if (s.data.length < cmpBox.props.range) {

        if (s.data.length > 1) {
          config.xAxis.range = s.data.length - 1;
          config.xAxis.max = s.data.length - 1;
          config.xAxis.min = 0;
        } else {
          config.xAxis.min = 0;
          config.xAxis.max = 1;
          config.xAxis.range = config.xAxis.max;
        }
      //newConfig.xAxis.range = newConfig.xAxis.max;
      }

      if (s.data.length === 0) {
        config.xAxis = null;
        config.yAxis = null;
        config.series = [{
          data: []
        }];
      } else {
        config.series = [s];
      }
      return [s];
    },
    pieConvertData(data, config, cmpBox) {
      var ret = ChartCmpStrategyFactor.convertDataFnStrategy.convertData(data, config, cmpBox);
      return [{
        type: 'pie',
        data: ret
      }];
    }
  },
  convertSingleItemFnStrategy: {
    convertSingleItem(item, s, cmpBox) {
      var d = s.data;
      if (!d) return;

      var converter = DataConverter,
        endTime = converter.JsonToDateTime(cmpBox.props.endTime, true),
        startTime = converter.JsonToDateTime(cmpBox.props.startTime, true);

      if (_.isArray(d) && d.length === 0) {
        d = [[startTime, null], [endTime, null]];
      } else {
        var step = s.option.step;
        var range = 100000;
        switch (step) {
          case 1: //hour add 30mins
            range = 3600000;
            break;
          case 2: //day add 12hours
            range = 24 * 3600000;
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

          var realEndTime = DataConverter.JsonToDateTime(cmpBox.props.endTime, true);
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
    pieConvertSingleItem(item, convertedItem) {
      convertedItem.y = item.y;
      delete convertedItem.data;
      delete convertedItem.marker; //for pie chart ,can't use marker
    }
  },


  getStrategyByChartType(chartType) {
    return ChartCmpStrategyFactor.getStrategyByConfig(ChartCmpStrategyFactor.strategyConfiguration[chartType]);
  },
  getStrategyByConfig: function(strategyConfig) {
    var strategyObj = {},
      cloneConfig = _.cloneDeep(strategyConfig);

    cloneConfig = CommonFuns.applyIf(cloneConfig, this.defaultStrategy);

    for (var n in cloneConfig) {
      strategyObj[n] = this[n + 'Strategy'][cloneConfig[n]];
    }
    return strategyObj;
  }
};
module.exports = ChartCmpStrategyFactor;
