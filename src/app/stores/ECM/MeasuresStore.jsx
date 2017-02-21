
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action} from '../../constants/actionType/Measures.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';

const MeasuresStore = assign({}, PrototypeStore, {

});

MeasuresStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_KPI_GROUP_CONTINUOUS:
        break;
      default:
    }
  });

  export default MeasuresStore;
