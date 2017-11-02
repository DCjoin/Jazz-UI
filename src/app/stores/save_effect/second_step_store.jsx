
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,Status,Msg} from '../../constants/actionType/Measures.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';

var _configCalendar=true;
const SecondStepStore = assign({}, PrototypeStore, {
  setConfigCalendar(data){
    _configCalendar=data
  },
  getConfigCalendar(){
    return _configCalendar
  }
})

SecondStepStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_CONFIG_CALENDAR_FOR_SAVEEFFECT:
        SecondStepStore.setConfigCalendar(action.data);
        SecondStepStore.emitChange()
        break;
    case Action.GET_CONFIG_CALENDAR_LOADING:
        _configCalendar='loading';
        break;
           }
  });

  export default SecondStepStore;