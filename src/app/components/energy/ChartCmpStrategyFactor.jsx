'use strict';
import React from "react";
import _ from 'lodash';
import CommonFuns from '../../util/Util.jsx';
import {dateAdd, dateFormat, DataConverter, isArray, isNumber, formatDateByStep, getDecimalDigits, toFixed, JazzCommon} from '../../util/Util.jsx';

let  tooltipPattern = '<span style="color:{0}">{1}: <b>{2}{3}</b></span><br/>';
let dataLabelFormatter = function(format) {
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

let ChartCmpStrategyFactor = {
  defaultStrategy: {
    convertDataFn:'convertData'
  },
  strategyConfiguration: {
    EnergyChartComponent:{
      mergeConfigFn:'energyChartCmpMergeConfig'
    },
    RankChartComponent:{

    },
    PieChartComponent:{
      mergeConfigFn:'pieChartCmpMergeConfig',
      convertDataFn:'pieConvertData'
    }
  },

  mergeConfigStrategy:{
    energyChartCmpMergeConfig(defaultConfig){
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
    pieChartCmpMergeConfig(defaultConfig){
      defaultConfig.tooltip.formatter = function () {
          var series = this.point.series,
              color = this.point.color,
              op = this.point.options,
              uom = op.option.uom,
              name = op.name;

          var y = this.y;
          if (y === null || y === 'null') y = 0;

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

          return (str + I18N.format( tooltipPattern, color, name, dataLabelFormatter.call({ value: y }, false), uom));
        };

        defaultConfig.tooltip.shared = false;
        defaultConfig.tooltip.crosshairs = false;

        defaultConfig.plotOptions.pie = {
            allowPointSelect: true,
            shadow: false,
            dataLabels: {
                enabled: true,
                align: 'left',
                formatter: function () {
                    var s = this.point.options.option.uom;
                    return dataLabelFormatter.call({ value: this.y }) + s + ', ' + toFixed(this.percentage, 1) + '%';
                }
            },
            showInLegend: true
        };
    }
  },
  convertDataFnStrategy:{
    convertData(data, config){
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
              //type: isBenchmarkLine ? 'line' : this.props.chartType,
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
              s.type = 'line';
          }else if(this.props.chartType == 'stack'){
            s.type = 'column';
            s.stacking = 'normal';
            s.stack = item.option.uomId;
          }else{
            s.type = this.props.chartType;
            s.stacking = undefined;
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
    pieConvertData(data, config){
       var ret = ChartCmpStrategyFactor.convertDataFnStrategy.convertData(data, config);
       return [{ type: 'pie', data: ret }];
    }
  },



  getStrategyByChartType (chartType) {
        return ChartCmpStrategyFactor.getStrategyByConfig(ChartCmpStrategyFactor.strategyConfiguration[chartType]);
  },
  getStrategyByConfig: function (strategyConfig) {
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
