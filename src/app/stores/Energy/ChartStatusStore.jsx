'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/ChartStatus.jsx';

let _energyData = null;
let _submitParams = null;
let _widgetDto = null;
let _isInitedByWidget = false;
let _bizType = null;
let _energyType = null;
let _seriesStatus = null;
let _chartType = null;

let ChartStatusStore = assign({}, PrototypeStore, {
  clearStatus() {
    _seriesStatus = [];
  },
  initStatus() {
    let me = this;
    _seriesStatus = [];
    if (!_energyData || !_energyData.TargetEnergyData) {
      return;
    } else {
      if (_widgetDto && _widgetDto.WidgetSeriesArray && _widgetDto.WidgetSeriesArray.length > 0) {
        let widgetSeriesArr = _widgetDto.WidgetSeriesArray;
        let seriesLength = widgetSeriesArr.length;
        let targetEnergyData = _energyData.TargetEnergyData;
        for (let i = 0, len = targetEnergyData.length; i < len; i++) {
          let target = targetEnergyData[i].Target;
          let status = {
            id: me.getIdByTarget(target)
          };
          if (i < seriesLength) { //如果有对应的状态，则保存；如果没有，则统一在assignStatus方法中添加状态
            let serie = widgetSeriesArr[i];
            status.ChartType = serie.ChartType;
            status.IsDisplay = serie.IsDisplay;
            status.SeriesType = serie.SeriesType;

            _seriesStatus.push(status);
          }
        }
      }
    }
  },
  modifySingleStatus(id, name, value) {
    if (_seriesStatus && _seriesStatus.length > 0) {
      let me = this;
      _seriesStatus.forEach(item => {
        if (item.id === id) {
          if (name === 'ChartType') {
            item[name] = me.getNumByChartType(value);
          } else {
            item[name] = value;
          }
          return;
        }
      });
    }
  },
  setWidgetDto(widgetDto, bizType, energyType, chartType) {
    _widgetDto = widgetDto;
    _isInitedByWidget = false;
    _bizType = bizType;
    _energyType = energyType;
    _chartType = chartType;
  },
  //此方法在获取energy data的store中调用
  onEnergyDataLoaded(energyData, submitParams) {
    _energyData = energyData;
    _submitParams = submitParams;
    if (!_isInitedByWidget) {
      this.initStatus();
      _isInitedByWidget = true;
    }
  },
  getSeriesStatus() {
    return _seriesStatus;
  },
  getIdByTarget(target) {
    if (_bizType === 'Energy' && _energyType === 'Energy') {
      if (_submitParams.viewOption.TimeRanges.length > 1) {
        return 'Id' + target.TimeSpan.StartTime + target.TimeSpan.EndTime + 'Type' + undefined;
      } else {
        return 'Id' + target.TargetId + 'Type' + target.Type;
      }
    } else if (_bizType === 'Unit' && _energyType === 'Energy') {
      return 'Id' + target.TargetId + 'Type' + target.Type;
    } else if ((_bizType === 'Energy' || _bizType === 'Unit') && _energyType === 'Cost') {
      return 'Id' + target.CommodityId + 'Type' + target.Type;
    }
    return '1';
  },
  getChartTypeFromWidgetChartType(chartType) {
    let typeMap = {
      Line: 'line',
      Column: 'column',
      Stack: 'stack',
      Pie: 'pie',
      DataTable: 'rawdata',
      original: 'rawdata'
    };
    return typeMap[chartType];
  },
  getNumByChartType(chartType) {
    let map = {
      line: 1,
      column: 2,
      stack: 4,
      stacking: 4,
      pie: 8,
      rawdata: 16,
      original: 16
    };
    return map[chartType];
  },
  getChartTypeByNum(num) {
    let chartTypeMap = {
      1: 'line',
      2: 'column',
      4: 'stack',
      8: 'pie'
    };
    return chartTypeMap[num];
  },
  assignStatus(newConfig) {
    let chartTypeMap = {
      1: 'line',
      2: 'column',
      4: 'stack',
      8: 'pie'
    };
    let me = this;
    let series = newConfig.series;
    let map = {};
    _seriesStatus = _seriesStatus || [];
    if (_seriesStatus && _seriesStatus.length > 0) {
      _seriesStatus.forEach((item, index) => {
        map[item.id] = item;
      });
    }
    series.forEach((item, index) => {
      if (item.id && map[item.id]) {
        item.visible = map[item.id].IsDisplay;
        if (map[item.id].ChartType === '4' || map[item.id].ChartType === 4) {
          item.type = 'column';
          item.stacking = 'normal';
        } else {
          item.type = chartTypeMap[map[item.id].ChartType];
          item.stacking = undefined;
        }
      } else if (item.id) {
        _seriesStatus.push({
          id: item.id,
          IsDisplay: true,
          SeriesType: item.dType,
          ChartType: me.getNumByChartType(item.type)
        });
      }
    });

  },
  getWidgetSaveStatus() {
    let status = [];
    if (_seriesStatus && _seriesStatus.length > 0) {
      _seriesStatus.forEach((item, index) => {
        status.push({
          IsDisplay: item.IsDisplay,
          ChartType: item.ChartType,
          SeriesType: item.SeriesType
        });
      });
    }
    return status;
  }
});

ChartStatusStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.SET_WIDGETDTO:
      ChartStatusStore.setWidgetDto(action.widgetDto, action.bizType, action.energyType, action.chartType);
      break;
    case Action.MODIFY_SINGLE_STATUS:
      ChartStatusStore.modifySingleStatus(action.id, action.name, action.value);
      break;
    case Action.CLEAR_STATUS:
      ChartStatusStore.clearStatus();
  }
});

module.exports = ChartStatusStore;
