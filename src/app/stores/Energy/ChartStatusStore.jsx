'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/ChartStatus.jsx';

let _chartSeriesStatus = null;
let _energyData = null;
let _submitParams = null;
let _widgetDto = null;
let _isInitedByWidget = false;
let _bizType = null;
let _energyType = null;
let _seriesStatus = null;

let ChartStatusStore = assign({}, PrototypeStore, {
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
          if (i < seriesLength) {
            let serie = widgetSeriesArr[i];
            status.ChartType = serie.ChartType;
            status.IsDisplay = serie.IsDisplay;
            status.SeriesType = serie.SeriesType;
          } else {
            status.ChartType = this.getNumByChartType(this.getChartTypeFromWidgetChartType(_widgetDto.ChartType) || 'line');
            status.IsDisplay = true;
            status.SeriesType = target.Type;
          }
          _seriesStatus.push(status);
        }
      } else {
        let targetEnergyData = _energyData.TargetEnergyData;
        for (let i = 0, len = targetEnergyData.length; i < len; i++) {
          let target = targetEnergyData[i].Target;
          let status = {
            id: me.getIdByTarget(target),
            IsDisplay: true,
            SeriesType: target.Type
          };
          status.ChartType = this.getNumByChartType(this.getChartTypeFromWidgetChartType(_widgetDto.ChartType) || 'line');
          _seriesStatus.push(status);
        }
      }
    }
  },
  modifySingleStatus(name, value, index) {
    //
  },
  setWidgetDto(widgetDto, bizType, energyType) {
    _widgetDto = widgetDto;
    _isInitedByWidget = false;
    _bizType = bizType;
    _energyType = energyType;
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
    return _chartSeriesStatus;
  },
  getIdByTarget(target) {
    if (_bizType === 'Energy' && _energyType === 'Energy') {
      return 'Id' + target.TargetId + 'Type' + target.Type;
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
      pie: 8,
      rawdata: 16,
      original: 16
    };
    return map[chartType];
  },
  assignStatus(newConfig) {
    //
    let series = newConfig.series;

  }
});

ChartStatusStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.SET_WIDGETDTO:
      ChartStatusStore.setWidgetDto(action.widgetDto, action.bizType, action.energyType);
      break;
  }
});

module.exports = ChartStatusStore;
