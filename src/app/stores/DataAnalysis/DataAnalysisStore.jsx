
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';

const DataAnalysisStore = assign({}, PrototypeStore, {
});

DataAnalysisStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.XX:
      break;
    default:
  }
});

export default DataAnalysisStore;
