'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Chart.jsx';

let ChartAction = {

  redrawChart(){
    AppDispatcher.dispatch({
        type: Action.REDRAW_CHART_IF_EXIST
    });
  }

};
module.exports = ChartAction;
