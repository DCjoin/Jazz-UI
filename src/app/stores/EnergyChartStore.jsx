'use strict';
/*
此store是为了出发让chart重新绘制的事件，
其中的一个使用场景是当在setting页面隐藏树panel的时候，重绘chart使它能撑满整个页面、
*/
import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import assign from 'object-assign';
import events from 'events';
let { EventEmitter } = events;
import {Action} from '../constants/actionType/Chart.jsx';

let REDRAW_CHART_EVENT = 'redrawchart';
var EnergyChartStore = assign({}, EventEmitter.prototype, {
  emitRedraw: function() {
    this.emit(REDRAW_CHART_EVENT);
  },

  /**
   * @param {function} callback
   */
  addRedrawListener: function(callback) {
    this.on(REDRAW_CHART_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeRedrawListener: function(callback) {
    this.removeListener(REDRAW_CHART_EVENT, callback);
    this.dispose();
  },
  dispose(){}
});

EnergyChartStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.REDRAW_CHART_IF_EXIST:
        EnergyChartStore.emitRedraw();
    }
});

module.exports = EnergyChartStore;
