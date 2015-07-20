'use strict';

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
